#!/usr/bin/env python3
"""Generate src/data/shortlisted.js from the final shortlist sheet.

Source: hacktoberfest_teams_final.xlsx
- "Teams" tab: the shortlist itself - one row per team where Team Size,
  Members and Emails must agree. The row named "Individual" is not a team;
  it groups the solo sign-ups and is split into one solo entry per person.
- "All Members" tab: per-person college (matched by email) and the Has Team
  flag, which must agree with the Teams tab.

- Keeps team / member / college only.
- Normalises college strings to one canonical name per institution.
- Folds teams signed up twice under two names (see TEAM_MERGES).
- Teams and solos sorted case-insensitively, solos last.
"""
import csv
import json
import re
import openpyxl

XLSX = '/home/darshan/Downloads/temp/hf26/FINAL/hacktoberfest_teams_final.xlsx'
OUT = 'src/data/shortlisted.js'
OUT_CSV = 'public/shortlisted.csv'

# Teams-tab row name that groups the solo sign-ups (Has Team = false).
SOLO_GROUP = 'individual'

# Same team registered twice under two names -> fold the first into the
# second. Black triad (Bhavani shankar Karnick, registered solo-ish on
# Oct 18) is member 3 of Dark triad on the attendance form (team size 3,
# github.com/Bhavani-Shankar2006), so everything folds into "Dark triad".
TEAM_MERGES = {
    'black triad': 'dark triad',
}

# --- canonical college names -------------------------------------------------
NOT_SPECIFIED = 'Not specified'
CANONICAL = {
    # Atria (event host) - every case/typo/city-suffix variant
    'atriait': 'Atria Institute of Technology',
    'atriainstituteoftechnology': 'Atria Institute of Technology',
    'atriainstitueoftechnology': 'Atria Institute of Technology',
    'atriainstitutionoftechnology': 'Atria Institute of Technology',
    'atriauniversity': 'Atria University',
    'nittemeenakshiinstitutetechnology': 'Nitte Meenakshi Institute of Technology',
    'nittemeenakshiinstituteoftechnology': 'Nitte Meenakshi Institute of Technology',
    'nmit': 'Nitte Meenakshi Institute of Technology',
    'saividyainstituteoftechnology': 'Sai Vidya Institute of Technology',
    'ramaiahinstituteoftechnology': 'Ramaiah Institute of Technology',
    'ramaiainstituteoftechnology': 'Ramaiah Institute of Technology',
    'ramaiahinstitueoftechnology': 'Ramaiah Institute of Technology',
    'msramaiainstituteoftechnology': 'Ramaiah Institute of Technology',
    'msramaiahcollegeofartssciencescommerce': 'M.S. Ramaiah College of Arts, Science & Commerce',
    'msramaiahcollegeofartsscienceandcommerce': 'M.S. Ramaiah College of Arts, Science & Commerce',
    'bangaloreinstituteoftechnology': 'Bangalore Institute of Technology',
    'bangloreinstituteoftechnology': 'Bangalore Institute of Technology',
    'dayanandasagarcollegeofengineering': 'Dayananda Sagar College of Engineering',
    'dayanandsagarcollegeofengineering': 'Dayananda Sagar College of Engineering',
    'cambridgeinstituteoftechnology': 'Cambridge Institute of Technology',
    'sjcinstituteoftechnology': 'SJC Institute of Technology',
    'vijayavittalainstituteoftechnology': 'Vijaya Vittala Institute of Technology',
    'donboscoinstituteoftechnology': 'Don Bosco Institute of Technology',
    'drambedkarinstituteoftechnology': 'Dr. Ambedkar Institute of Technology',
    'eastpointcollegeofengineeringandtechnology': 'East Point College of Engineering and Technology',
    'kramakrishnancollegeofengineering': 'K. Ramakrishnan College of Engineering',
    'sirmvisvesvarayainstituteoftechnology': 'Sir M. Visvesvaraya Institute of Technology',
    'jainuniversity': 'JAIN University',
    'cmruniversity': 'CMR University',
    'bmsit': 'BMS Institute of Technology',
    'bmstcollegeofengineering': 'BMS College of Engineering',
    'ksinsituteoftechnology': 'K.S. Institute of Technology',
    'tochinstituteoftechnology': 'Toc H Institute of Technology',
    'kiit': 'KIIT University',
    'kristujayanti': 'Kristu Jayanti College',
    'allianceuniversitybengaluru': 'Alliance University',
    'amityuniversitybengaluru': 'Amity University, Bengaluru',
    'icfai': 'ICFAI University',
    'iitmadrasbs': 'IIT Madras (BS)',
    'veltech': 'Vel Tech University',
    'mitblr': 'MIT Bengaluru',
    'universityofmysore': 'University of Mysore',
    'karavaliofengineeringtechnology': 'Karavali Institute of Technology, Mangalore',
    'karavaliofinstitutetechnologymangalore': 'Karavali Institute of Technology, Mangalore',
    'kalaignarkarunanidhiinstituteoftechnology': 'Kalaignar Karunanidhi Institute of Technology',
    'lategnsapkacollegeofengineeringsnashikmaharashtra':
        'Late G.N. Sapkal College of Engineering, Nashik',
    'rajeevgandhimemorialcollegeofengineeringandtechnologynandyala':
        'Rajeev Gandhi Memorial College of Engineering and Technology, Nandyala',
    'sjbinstituteoftechnologybengaluru': 'SJB Institute of Technology, Bengaluru',
    'amcengineeringcollege': 'AMC Engineering College',
    'akashinstituteofengineeringandtechnology': 'Akash Institute of Engineering and Technology',
    'nxtwaveofinnovationinadvancedtechnologies': 'NxtWave',
    'startupstealth': 'Stealth Startup',
    'givabitspilani': 'GIVA / BITS Pilani',
    'svyasauniversitybosscoderschooloftechnology': 'S-VYASA University / Bosscoder School of Technology',
    'bharatiyaengineeringscienceandtechnologyinnovationuniversity':
        'Bharatiya Engineering Science and Technology Innovation University',
    'heritageinstituteoftechnology': 'Heritage Institute of Technology',
    'newhorizoncollegeofengineering': 'New Horizon College of Engineering',
    'newtonschooloftechnology': 'Newton School of Technology',
    'polarisschooloftechnology': 'Polaris School of Technology',
    'srivenkateshwaraCollegeofengineering'.lower(): 'Sri Venkateshwara College of Engineering',
    'tjohninstituteoftechnology': 'T. John Institute of Technology',
    'visvesvarayatechnologicaluniversity': 'Visvesvaraya Technological University',
    'presidencyuniversity': 'Presidency University',
    'bmscollegeofengineering': 'BMS College of Engineering',
    'brototype': 'Brototype',
    'accenture': 'Accenture',
    'infosys': 'Infosys',
    'optum': 'Optum',
    'statestreet': 'State Street',
    'antino': 'Antino',
    'ufuqtechs': 'Ufuqtechs',
    'dhruva': 'Dhruva',
    'iimbangalore': 'IIM Bangalore',
    # Placeholders people typed instead of a college
    '': NOT_SPECIFIED,
    'college': NOT_SPECIFIED,
    'collage': NOT_SPECIFIED,
    'individual': NOT_SPECIFIED,
}


def key(raw):
    return re.sub(r'[^a-z0-9]+', '', (raw or '').strip().lower())


def canonical(raw):
    k = key(raw)
    if k in CANONICAL:
        return CANONICAL[k]
    # Common infix variants (case, "of/of the", city suffixes) fall back here.
    for pattern, name in RULES:
        if pattern.search(k):
            return name
    return None


RULES = [
    (re.compile(r'^atria.*instit'), 'Atria Institute of Technology'),
    (re.compile(r'^nittemeenakshi'), 'Nitte Meenakshi Institute of Technology'),
    (re.compile(r'^saividya'), 'Sai Vidya Institute of Technology'),
    (re.compile(r'^.*ramaiahinstit(ute|ue)'), 'Ramaiah Institute of Technology'),
    (re.compile(r'gnsapkal'), 'Late G.N. Sapkal College of Engineering, Nashik'),
    (re.compile(r'^msramaiahcollegeofarts'), 'M.S. Ramaiah College of Arts, Science & Commerce'),
    (re.compile(r'^(bangalore|banglore)instituteoftechnology'), 'Bangalore Institute of Technology'),
    (re.compile(r'^dayanand?as?agarcollegeofengineering'), 'Dayananda Sagar College of Engineering'),
    (re.compile(r'^cambridgeinstituteoftechnology'), 'Cambridge Institute of Technology'),
    (re.compile(r'^s*j*cinstituteoftechnology'), 'SJC Institute of Technology'),
    (re.compile(r'^vijayavittala'), 'Vijaya Vittala Institute of Technology'),
    (re.compile(r'^donbosco'), 'Don Bosco Institute of Technology'),
    (re.compile(r'^d?r\.?ambedkarinstitute'), 'Dr. Ambedkar Institute of Technology'),
    (re.compile(r'^eastpoint'), 'East Point College of Engineering and Technology'),
    (re.compile(r'^k\.?ramakrishnancollege'), 'K. Ramakrishnan College of Engineering'),
    (re.compile(r'^sirm?visvesvaraya.*institute'), 'Sir M. Visvesvaraya Institute of Technology'),
    (re.compile(r'^karavali'), 'Karavali Institute of Technology, Mangalore'),
]


def main():
    wb = openpyxl.load_workbook(XLSX, data_only=True)

    # Per-person facts from the All Members tab, keyed by email.
    people = {}
    for row in wb['All Members'].iter_rows(min_row=2, values_only=True):
        if not any(row):
            continue
        email = (row[2] or '').strip().lower()
        people[email] = {
            'college': (row[6] or '').strip(),
            'has_team': bool(row[4]),
        }

    teams, solos, unmapped, used = [], [], set(), set()
    for row in wb['Teams'].iter_rows(min_row=2, values_only=True):
        if not any(row):
            continue
        team = (row[0] or '').strip()
        size = int(row[1])
        names = [n.strip() for n in (row[4] or '').split(';') if n.strip()]
        emails = [e.strip().lower() for e in (row[5] or '').split(';') if e.strip()]
        if not len(names) == len(emails) == size:
            raise SystemExit(
                f'{team}: Team Size {size} but {len(names)} names / {len(emails)} emails')

        solo_row = team.lower() == SOLO_GROUP
        members = []
        for name, email in zip(names, emails):
            person = people.get(email)
            if person is None:
                raise SystemExit(f'{team}: {email} not on the All Members tab')
            if person['has_team'] == solo_row:
                raise SystemExit(
                    f'{team}: {email} has Has Team={person["has_team"]}, '
                    f'contradicts the Teams tab')
            used.add(email)
            college = canonical(person['college'])
            if college is None:
                unmapped.add(person['college'])
                college = person['college']
            members.append({'name': name, 'college': college})

        if solo_row:
            # The "Individual" row is the solo bucket: one entry per person.
            solos.extend(
                {'team': f'Solo: {m["name"]}', 'solo': True, 'members': [m]}
                for m in members
            )
        else:
            teams.append({'team': team, 'solo': False, 'members': members})

    # Fold duplicate sign-ups of the same team into one entry.
    for source_key, target_key in TEAM_MERGES.items():
        source = next((g for g in teams if g['team'].casefold() == source_key), None)
        if source is None:
            continue  # already absent from a future revision of the sheet
        target = next((g for g in teams if g['team'].casefold() == target_key), None)
        if target is None:
            raise SystemExit(f'merge target {target_key!r} missing for {source["team"]!r}')
        seen = {m['name'].casefold() for m in target['members']}
        for m in source['members']:
            if m['name'].casefold() in seen:
                raise SystemExit(f'{target["team"]}: {m["name"]} listed twice after merge')
            seen.add(m['name'].casefold())
            target['members'].append(m)
        teams.remove(source)

    if used != set(people):
        missing = sorted(set(people) - used)
        raise SystemExit('All Members rows not on the Teams tab: ' + ', '.join(missing))
    if unmapped:
        raise SystemExit('UNMAPPED COLLEGES:\n' + '\n'.join(sorted(unmapped)))

    by_name = lambda g: g['team'].casefold()
    teams.sort(key=by_name)
    solos.sort(key=by_name)
    payload = teams + solos
    members_total = sum(len(g['members']) for g in payload)

    # Stats are derived from the roster at runtime, so they can never drift
    # out of sync with the data the generator writes above.
    js = ('// Generated by scripts/build_shortlisted.py - do not edit by hand.\n'
          '// Source: hacktoberfest_teams_final.xlsx (final shortlist sheet).\n'
          'export const SHORTLISTED_TEAMS = '
          + json.dumps(payload, ensure_ascii=False, indent=2) + ';\n\n'
          'export const SHORTLISTED_STATS = SHORTLISTED_TEAMS.reduce(\n'
          '  (acc, group) => {\n'
          "    acc[group.solo ? 'solo' : 'teams'] += 1;\n"
          '    acc.members += group.members.length;\n'
          '    return acc;\n'
          '  },\n'
          '  { teams: 0, solo: 0, members: 0 }\n'
          ');\n')
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(js)

    # Same roster as a spreadsheet: team name once per group, solos last.
    with open(OUT_CSV, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f)
        w.writerow(['Team Name', 'Member Name', 'College / Organization'])
        for group in payload:
            for i, member in enumerate(group['members']):
                if group['solo']:
                    team_cell = 'Solo'
                else:
                    team_cell = group['team'] if i == 0 else ''
                w.writerow([team_cell, member['name'], member['college']])

    print(f'wrote {OUT}: {len(teams)} teams, {len(solos)} solos, {members_total} members')
    print(f'wrote {OUT_CSV}: {members_total} rows')


if __name__ == '__main__':
    main()
