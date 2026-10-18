#!/usr/bin/env python3
"""Generate src/data/shortlisted.js from the teamwise registration workbook.

- Keeps team / member / college only.
- Drops members who did not answer the last 3 questions on the MLH export
  (Do you have a team? / What is your team name? / Join our WhatsApp group).
- Normalises college strings to one canonical name per institution.
- Groups members under one team row, teams in workbook order, solos last.
"""
import csv
import json
import openpyxl

XLSX = '/home/darshan/Downloads/temp/hf26/hacktoberfest_teamwise_registrations_normalized.xlsx'
CSV = ('/home/darshan/Downloads/temp/hf26/'
       '2026-10-18-hacktoberfest-hack-day-bengaluru-x-aws-student-builder-group-'
       'at-atria-institute-of-technology-registrations-export.csv')
OUT = 'src/data/shortlisted.js'

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

import re


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


# --- last-3-question filter --------------------------------------------------
def answered(row):
    team = (row['Do you have a team?'] or '').strip()
    team_name = (row['What is your team name?'] or '').strip()
    whatsapp = (row['Join our WhatsApp group'] or '').strip()
    if not team and not team_name and not whatsapp:
        return False
    if not team or not whatsapp:
        return False
    return team.lower() == 'no' or bool(team_name)


def main():
    with open(CSV, newline='', encoding='utf-8-sig') as f:
        csv_rows = list(csv.DictReader(f))
    by_email = {}
    for row in csv_rows:
        by_email.setdefault((row['email'] or '').strip().lower(), []).append(row)

    wb = openpyxl.load_workbook(XLSX)
    ws = wb['Teamwise Roster']
    roster = [r for r in ws.iter_rows(min_row=5, values_only=True) if any(r)]

    groups, order = {}, []
    dropped = 0
    unmapped = set()
    current_key = None
    team_names = {}
    for row in roster:
        team = (row[0] or '').strip()
        member = (row[1] or '').strip()
        college_raw = (row[4] or '').strip()
        email = (row[2] or '').strip().lower()

        # The team cell is only filled on the first row of a group; blank means
        # "same team as the row above".
        if team:
            if team.lower().startswith('solo:'):
                current_key = ('solo', member.lower())
            else:
                current_key = ('team', team.lower())
            team_names[current_key] = team

        rows = by_email.get(email, [])
        if not rows or not any(answered(r) for r in rows):
            dropped += 1
            continue

        canon = canonical(college_raw)
        if canon is None:
            unmapped.add(college_raw)
            canon = college_raw

        if current_key not in groups:
            groups[current_key] = {
                'team': team_names.get(current_key, ''),
                'solo': current_key[0] == 'solo',
                'members': [],
            }
            order.append(current_key)
        groups[current_key]['members'].append({'name': member, 'college': canon})

    if unmapped:
        raise SystemExit('UNMAPPED COLLEGES:\n' + '\n'.join(sorted(unmapped)))

    teams = [groups[k] for k in order if not groups[k]['solo']]
    solos = [groups[k] for k in order if groups[k]['solo']]
    payload = teams + solos

    members = sum(len(g['members']) for g in payload)
    stats = {
        'teams': len(teams),
        'solo': len(solos),
        'members': members,
        'dropped': dropped,
    }

    js = ('// Generated by scripts/build_shortlisted.py - do not edit by hand.\n'
          f'// Source: teamwise workbook, filtered against the MLH export (last 3 questions).\n'
          'export const SHORTLISTED_STATS = ' + json.dumps(stats) + ';\n\n'
          'export const SHORTLISTED_TEAMS = '
          + json.dumps(payload, ensure_ascii=False, indent=2) + ';\n')
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(js)
    print(f'wrote {OUT}: {len(teams)} teams, {len(solos)} solos, '
          f'{members} members, dropped {dropped}')


if __name__ == '__main__':
    main()
