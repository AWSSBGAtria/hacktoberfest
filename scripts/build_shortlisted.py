#!/usr/bin/env python3
"""Shared roster logic + generator for src/data/shortlisted.js.

Source: hacktoberfest_teams_final.xlsx (FINAL folder)
- "Teams" tab is the source of truth: one row per team (Members and Emails
  are semicolon lists; Colleges, when present, align positionally). The row
  named "Individual" is not a team - it groups the solo sign-ups.
- "All Members" tab only fills colleges the Teams tab left blank.

Cleanup the sheet does not do by itself (reported as notes):
- TEAM_MERGES: same team signed up twice under two names.
- Solos who also appear on a team row are dropped from the solos.
- Team Size / name-count mismatches trust the names.

Colleges are canonicalised to one name per institution. Site output keeps
"Not specified" when nothing is known; consumers that want blanks (the
formatted Excel) check for it themselves. Teams and solos sorted
case-insensitively, solos last.
"""
import csv
import json
import re
import openpyxl

XLSX = '/home/darshan/Downloads/temp/hf26/FINAL/hacktoberfest_teams_final.xlsx'
FORMATTED = '/home/darshan/Downloads/temp/hf26/FINAL/hacktoberfest_teams_final_formatted.xlsx'
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
    'bmsinstituteoftechnologyandmanagement': 'BMS Institute of Technology and Management',
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
    # Already a canonical value (e.g. a hand correction) - keep it as-is.
    if raw and raw in set(CANONICAL.values()):
        return raw
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
    (re.compile(r'^bmsinstituteoftechnologyandmanagement'), 'BMS Institute of Technology and Management'),
    (re.compile(r'^eastpoint'), 'East Point College of Engineering and Technology'),
    (re.compile(r'^k\.?ramakrishnancollege'), 'K. Ramakrishnan College of Engineering'),
    (re.compile(r'^sirm?visvesvaraya.*institute'), 'Sir M. Visvesvaraya Institute of Technology'),
    (re.compile(r'^karavali'), 'Karavali Institute of Technology, Mangalore'),
]


def load_formatted_colleges():
    """Read per-email college corrections from the formatted workbook.

    Only non-empty college cells are honoured, so the file can be hand-edited
    to override the main sheet's college for a given person.
    """
    corrections = {}
    try:
        wb = openpyxl.load_workbook(FORMATTED, data_only=True)
    except FileNotFoundError:
        return corrections
    ws = wb['Attendees']
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not any(row):
            continue
        email = (row[2] or '').strip().lower()
        college = (row[3] or '').strip()
        if email and college:
            corrections[email] = college
    return corrections


def load_roster():
    """Read the final sheet -> (teams, solos, notes) in sheet order.

    Groups look like {'team', 'solo', 'members: [{'name', 'email', 'college'}]}.
    """
    wb = openpyxl.load_workbook(XLSX, data_only=True)

    # College per email from the All Members tab (fallback only).
    people = {}
    for row in wb['All Members'].iter_rows(min_row=2, values_only=True):
        if not any(row):
            continue
        people[(row[2] or '').strip().lower()] = (row[6] or '').strip()

    notes = []
    formatted = load_formatted_colleges()

    teams, solo_people = [], []
    for row in wb['Teams'].iter_rows(min_row=2, values_only=True):
        if not any(row):
            continue
        team = (row[0] or '').strip()
        size = int(row[1])
        names = [n.strip() for n in (row[4] or '').split(';') if n.strip()]
        emails = [e.strip().lower() for e in (row[5] or '').split(';') if e.strip()]
        colleges = [c.strip() for c in (row[6] or '').split(';') if c.strip()]
        if len(names) != len(emails):
            raise SystemExit(f'{team}: {len(names)} names but {len(emails)} emails')
        if size != len(names):
            notes.append(f'{team}: Team Size column says {size}, trusting {len(names)} names')

        members = []
        for i, (name, email) in enumerate(zip(names, emails)):
            # Order of trust: formatted (hand-corrected) > Teams tab > All Members.
            base = colleges[i] if i < len(colleges) else ''
            raw = formatted.get(email) or base or people.get(email, '')
            college = canonical(raw)
            if college is None:
                raise SystemExit(f'unmapped college {raw!r} ({name}, {team})')
            # Only report when the correction actually changes the college
            # (not just its string form - the formatter writes canonical).
            if email in formatted and canonical(base) != college and base.strip() != college:
                notes.append(f'{name}: college set from formatted file -> {college}')
            members.append({'name': name, 'email': email, 'college': college})

        if team.lower() == SOLO_GROUP:
            solo_people.extend(members)
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
        seen = {m['email'] for m in target['members']}
        for m in source['members']:
            if m['email'] in seen:
                notes.append(f'{target["team"]}: {m["name"]} already on the team after merge')
                continue
            target['members'].append(m)
            notes.append(f'{target["team"]}: absorbed {m["name"]} from {source["team"]}')
        teams.remove(source)

    # A solo who is also listed on a team row belongs to the team.
    on_team = {m['email'] for g in teams for m in g['members']}
    kept = [p for p in solo_people if p['email'] not in on_team]
    for p in solo_people:
        if p['email'] in on_team:
            notes.append(f'{p["name"]}: dropped from solos - listed on a team')
    solos = [{'team': f'Solo: {p["name"]}', 'solo': True, 'members': [p]} for p in kept]
    return teams, solos, notes


def main():
    teams, solos, notes = load_roster()
    for note in notes:
        print('note:', note)

    by_name = lambda g: g['team'].casefold()
    teams.sort(key=by_name)
    solos.sort(key=by_name)
    payload = [
        {
            'team': g['team'],
            'solo': g['solo'],
            'members': [{'name': m['name'], 'college': m['college']} for m in g['members']],
        }
        for g in teams + solos
    ]
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
                college = None if member['college'] == NOT_SPECIFIED else member['college']
                w.writerow([team_cell, member['name'], college])

    print(f'wrote {OUT}: {len(teams)} teams, {len(solos)} solos, {members_total} members')
    print(f'wrote {OUT_CSV}: {members_total} rows')


if __name__ == '__main__':
    main()
