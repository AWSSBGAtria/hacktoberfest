/**
 * Full-length track briefs for /tracks/open-source-ai, /tracks/gemma-4 and
 * /tracks/aws. The /build cards stay the short spec sheets; these pages are
 * the complete briefs - requirements, judging guidance, partner info and
 * resources - sourced from the MLH Hack Days handbook, the DeepAgentLabs
 * sponsor dossier and the Great Data Labs profile.
 *
 * Judging stays percentage-free on purpose: one unified criteria sheet is
 * shared across all three tracks, so no per-track weights belong on a page.
 *
 * Sections are arrays of typed blocks rendered by TrackDetailPage:
 * prose | cards | table | chips | stats | links | steps | callout
 */

export const TRACK_PAGES = {
  'open-source-ai': {
    slug: '/tracks/open-source-ai',
    number: '01',
    title: 'Best Open-Source AI Project',
    tag: 'Core Hacktoberfest Challenge',
    accent: '#e53927',
    accentInk: '#f7f7f2',
    pacColor: '#e53927',
    deck:
      'The main Hacktoberfest challenge, run at every in-person Hack Day. Build something original where open-source or open-weight AI does the real work, ship it to a public GitHub repo, and have it reviewed by the people who build the tools.',
    partner: {
      name: 'DeepAgentLabs',
      role: 'Governing partner',
      line: 'Building open tools for operating agentic AI',
      links: [
        { label: 'Website', href: 'https://deepagentlabs.io' },
        { label: 'GitHub', href: 'https://github.com/DeepAgentLabs' },
        { label: 'Student Discord', href: 'https://discord.gg/fEqPFWgcDG' },
      ],
    },
    facts: [
      { value: 'SLM ≤ 10B · LLM > 10B', label: 'Open-weight model sizes' },
      { value: 'Public repo + license', label: 'Non-negotiable' },
      { value: '~402K+ downloads', label: 'DeepAgentLabs on PyPI' },
      { value: 'Mentored all day', label: 'Maintainers on the floor' },
    ],
    sections: [
      {
        id: 'brief',
        eyebrow: 'The brief',
        title: 'One prize category,',
        accent: 'three ways in.',
        deck:
          'Every in-person Hacktoberfest Hack Day runs this challenge. Your host sets the open and close times for submissions and how demos work on the day.',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Build something original with open-source or open-weight AI. These three shapes are starting points within one prize category - you can combine them or take a different approach entirely.',
            ],
          },
          {
            kind: 'cards',
            items: [
              {
                title: 'Agent skill',
                body: 'A reusable capability for an AI agent. If you build one, follow the Agent Skills open standard so any compatible harness can load it.',
              },
              {
                title: 'LLM-powered application',
                body: 'An application where a small or large open-weight language model does real work - understanding, generating, classifying, or deciding.',
              },
              {
                title: 'Model harness',
                body: 'An original implementation, or meaningful changes to an existing open-source harness. A renamed copy alone does not meet this requirement.',
              },
            ],
          },
          {
            kind: 'callout',
            title: 'The definitions judges use',
            body:
              'An open-weight model makes trained weights available to download or run under its provider\'s terms - open-weight does not automatically mean the whole model is open source. A small language model has 10 billion parameters or fewer; a large language model has more than 10 billion. Name the model you used and link to its license or terms in your README.',
          },
        ],
      },
      {
        id: 'requirements',
        eyebrow: 'Entry requirements',
        title: 'What your project',
        accent: 'needs to ship with.',
        blocks: [
          {
            kind: 'cards',
            items: [
              {
                title: 'AI does important work',
                body: 'Open-source or open-weight AI must be an important part of how the project works - and you need to show what the AI does in your demo.',
              },
              {
                title: 'Public repo, real license',
                body: 'Publish in a public GitHub repository with an open-source license. A public repository without a license does not meet this challenge.',
              },
              {
                title: 'A README that carries it',
                body: 'Explain what you built, how to run or try it, and which model and key dependencies you used.',
              },
              {
                title: 'Standards where they matter',
                body: 'Agent skills follow the Agent Skills open standard. Harnesses show original implementation or meaningful changes - not a rebrand.',
              },
            ],
          },
          {
            kind: 'prose',
            lead: 'Self-check before you submit:',
            bullets: [
              'Someone outside your team can open the repository, find its license, understand the AI contribution, and follow the README to try the project.',
              'You can explain the problem, your approach, and the impact in under two minutes.',
              'Your demo works - or you have a recording that does.',
            ],
          },
        ],
      },
      {
        id: 'partner',
        eyebrow: 'Governing partner',
        title: 'DeepAgentLabs',
        accent: 'reviews this track.',
        pacColor: '#e53927',
        deck:
          'A community-led open-source ecosystem for the operational needs of agentic AI: observability, supervision, evaluation, reliability testing, and operational workflows.',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'DeepAgentLabs sponsors and governs Best Open-Source AI Project at this Hack Day, helping participants shape useful projects and reviewing submissions against a shared rubric. Eligible work is a new open-source AI project, or a meaningful extension, integration, example, evaluation, policy pack, or operational feature.',
              'Their vision: make agentic AI systems more observable, reliable, governable, and production-ready through open, interoperable tools - modular components teams can adopt individually or combine into an end-to-end workflow.',
            ],
          },
          {
            kind: 'stats',
            items: [
              { value: '~402K+', label: 'PyPI downloads (live dashboard, Oct 12 2026)' },
              { value: '6', label: 'PyPI packages in the ecosystem' },
              { value: '10+', label: 'Community contributors' },
              { value: '4', label: 'Maintainers' },
            ],
          },
          {
            kind: 'table',
            caption: 'The ecosystem - what each component is for',
            head: ['Component', 'Focus', 'In plain words'],
            rows: [
              ['AgenticLens', 'Agent observability', 'Tracks what your agent did, what it cost, and how to make it better.'],
              ['Agentic-Sidecar', 'Runtime supervision', 'A critic, judge, risk evaluator or policy advisor reviewing decisions before the agent acts.'],
              ['Agentic-Evals', 'Evaluation', 'Checks whether the agent\'s answers are actually good, against defined criteria.'],
              ['Agentic-Chaos', 'Reliability testing', 'Breaks things on purpose to see if the agent can cope.'],
              ['Deep-Agentic-Core-MCP', 'MCP connectivity', 'Connects agentic tooling and workflows through Model Context Protocol.'],
              ['AgenticOps Control Tower', 'Operations', 'One place to monitor and manage everything.'],
              ['AI Operations Spec', 'Interchange & replay', 'Captured operational flows in a structured format for review and repeatable testing.'],
            ],
          },
          {
            kind: 'chips',
            label: 'Contribution areas open to students',
            items: [
              'Python development',
              'Agentic AI workflows',
              'Cloud-native (Docker, K8s, AWS)',
              'Documentation',
              'Integrations (LangChain, CrewAI, MCP)',
              'Research & benchmarking',
              'Technical blogs',
              'Examples & use cases',
              'Issue triage & community',
            ],
          },
          {
            kind: 'callout',
            title: 'Build with their tools - or don\'t',
            body:
              'Use any or all DeepAgentLabs tools to build; projects that use their packages get featured on the DeepAgentLabs website. But projects can stand on their own as open-source work - ecosystem integration is one path, not a requirement. Contribution certificates, maintainer mentorship and a visible GitHub portfolio are on offer for students of any skill level, including first-time contributors.',
            note: 'Student community: discord.gg/fEqPFWgcDG · GitHub: github.com/DeepAgentLabs · Contact: Pramod B N, Lead Architect (Atria CSE alumnus, 2017-2021).',
          },
        ],
      },
      {
        id: 'judging',
        eyebrow: 'Judging',
        title: 'How the track',
        accent: 'is decided.',
        blocks: [
          {
            kind: 'cards',
            items: [
              { title: 'Innovation and usefulness', body: 'Originality and relevance to real developer or operational needs.' },
              { title: 'Technical implementation', body: 'Sound architecture, code quality, packaging, integrations, and cloud-native practices where applicable.' },
              { title: 'Open-source practices', body: 'Clear documentation, examples, tests, CI, license, issue/PR workflow, and contribution guidance.' },
              { title: 'Impact and adoption potential', body: 'Reusability, community value, and potential to integrate with the DeepAgentLabs ecosystem.' },
              { title: 'Demo and presentation', body: 'A clear demonstration and concise explanation of the problem, approach, and impact.' },
            ],
          },
          {
            kind: 'prose',
            paragraphs: [
              'All three tracks of this Hack Day are judged against one unified criteria sheet, so your work is measured on the same standard whichever challenge you enter.',
              'The host selects one winning team. A strong entry meets the requirements, solves a clear problem or creates a useful experience, shows substantial work by the team, and has a working demo with an understandable explanation. Judges verify the source, license, model, and dependencies for themselves - pull-request counts do not decide this prize.',
              'Prize: every member of the winning team receives a DEV badge on their DEV account; MLH may also provide MLH+DEV branded swag bags where available. Track prizes for this Hack Day are confirmed closer to the day.',
            ],
          },
        ],
      },
      {
        id: 'resources',
        eyebrow: 'Resources',
        title: 'Everything you need,',
        accent: 'nothing you don\'t.',
        blocks: [
          {
            kind: 'links',
            items: [
              { label: 'The official MLH challenge brief', href: 'https://mlh.com/opensource-ai', desc: 'Rules, requirements and winner guidance, straight from MLH.' },
              { label: 'Agent Skills specification', href: 'https://agentskills.io/specification', desc: 'Required format if your entry is an agent skill.' },
              { label: 'Hugging Face Transformers quickstart', href: 'https://huggingface.co/docs/transformers/quicktour', desc: 'Load a pretrained model, run inference, explore fine-tuning.' },
              { label: 'Ollama quickstart', href: 'https://docs.ollama.com/quickstart', desc: 'Run a local model in minutes and build against its API.' },
              { label: 'Gemma model overview', href: 'https://ai.google.dev/gemma/docs/core', desc: 'Open-weight models at different sizes, from Google.' },
              { label: 'Hugging Face model cards', href: 'https://huggingface.co/docs/hub/model-cards', desc: 'Check intended uses, limitations and license before you build.' },
              { label: 'OpenCode agent skills guide', href: 'https://opencode.ai/docs/skills', desc: 'How an open-source agent harness discovers and loads skills.' },
              { label: 'OSI license list', href: 'https://opensource.org/licenses', desc: 'Pick a recognized open-source license for your repo.' },
              { label: 'GitHub licensing guide', href: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository', desc: 'How to actually add the license file on GitHub.' },
            ],
          },
          {
            kind: 'callout',
            title: 'Need data? Great Data Labs has you covered',
            body:
              'Great Data Labs is an open-source initiative for practical data and AI engineering, and its flagship project great-generator does schema-driven synthetic data generation - realistic relational and domain-oriented datasets for prototyping, testing, demos and pipeline development, without depending on real production records. Pandas and Apache Spark workflows, CSV / Parquet / Delta output.',
            note: 'github.com/ravikiranpagidi/great-generator · greatdatalabs@proton.me',
          },
          {
            kind: 'callout',
            title: 'Deploy it on DigitalOcean (optional)',
            body:
              'DigitalOcean supports this prize category. Using it is not required, but you can host an app, API or model workflow on it. Attendees registered for an in-person Hacktoberfest event find a $25 credit under "My Hacktoberfest promos" on hacktoberfest.com - credit links last three full days once activated and expire after October 31, 2026. Read the offer terms before activating.',
            note: 'App Platform and Droplets quickstarts are in the MLH brief; GradientAI covers hosted inference and agent workflows.',
          },
        ],
      },
      {
        id: 'submit',
        eyebrow: 'Submit',
        title: 'Five steps,',
        accent: 'then demo.',
        blocks: [
          {
            kind: 'steps',
            items: [
              { title: 'Finish and push', body: 'Your code lives in a public GitHub repository, with a license and a README that explains the build.' },
              { title: 'Run the self-check', body: 'Outside perspective, working demo, clear AI story. If any of the three is shaky, fix it before submitting.' },
              { title: 'One teammate submits', body: 'Through your event\'s OrganizerHQ Challenges page, before the host\'s deadline.' },
              { title: 'Tick the right boxes', body: 'Add the repo link, project name, description, technologies used and a demo URL. Select Best Open-Source AI Project - plus any other challenge your project is eligible for.' },
              { title: 'Demo on the floor', body: 'Your host may ask you to demonstrate the working project and explain what your team built during the event.' },
            ],
          },
        ],
      },
    ],
  },

  'gemma-4': {
    slug: '/tracks/gemma-4',
    number: '02',
    title: 'Best Use of Gemma 4',
    tag: 'Google Partner Challenge',
    accent: '#5146d9',
    accentInk: '#f7f7f2',
    pacColor: '#aebcff',
    deck:
      'It\'s time to see how much you can build with a lightweight, open model. Gemma 4 packs multimodal intelligence into an open-weights model you reach through the Gemini API - so you can move from an idea to a working prototype fast.',
    partner: {
      name: 'Google Gemma',
      role: 'Partner challenge, via MLH',
      line: 'Open weights, multimodal, on the Gemini API',
      links: [
        { label: 'Gemma 4 resources', href: 'https://mlh.link/gemma' },
        { label: 'Quickstart', href: 'https://mlh.link/gemma-quickstart' },
        { label: 'API docs', href: 'https://mlh.link/gemma-docs' },
      ],
    },
    facts: [
      { value: 'Open weights', label: 'Reached through the Gemini API' },
      { value: 'Text + images', label: 'Multimodal by default' },
      { value: 'Name the model', label: 'Required in your README' },
      { value: 'Combine freely', label: 'Also enter any track you qualify for' },
    ],
    sections: [
      {
        id: 'brief',
        eyebrow: 'The brief',
        title: 'Bring your idea to life -',
        accent: 'what will you build with Gemma 4?',
        pacColor: '#aebcff',
        deck:
          'Google supports MLH and the Hack Days program with AI tools for experimentation and rapid prototyping. This challenge is your excuse to find the ceiling.',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Gemma 4 can help you work with text and images, build a focused AI tool, or experiment with an open model while the Gemini API handles the plumbing. Pick whichever fits your team - judges care that Gemma does real work in the build.',
            ],
          },
          {
            kind: 'cards',
            items: [
              {
                title: 'An assistant that understands more',
                body: 'Work with text and images together - receipts, diagrams, screenshots, whiteboards, photos of handwritten notes. Build something that actually understands what users share.',
              },
              {
                title: 'A focused AI tool',
                body: 'Pick one audience - learning, creativity, productivity, or your community - and solve a real problem for them. Small scope, finished beats broad scope, demoed badly.',
              },
              {
                title: 'A fast, honest experiment',
                body: 'Use the Gemini API to move quickly from idea to working prototype. The track rewards shipping something real in a day, not a research paper.',
              },
            ],
          },
        ],
      },
      {
        id: 'requirements',
        eyebrow: 'Entry requirements',
        title: 'What counts',
        accent: 'as Gemma 4 work.',
        blocks: [
          {
            kind: 'cards',
            items: [
              {
                title: 'Actually use a Gemma model',
                body: 'Through the Gemini API. Judges confirm the winning project genuinely calls a Gemma model - a mention in the pitch is not an integration.',
              },
              {
                title: 'Name the model in your README',
                body: 'Which Gemma model, where it is called, and how to run the project. If you also enter Best Open-Source AI Project, the public-repo and license rules apply too.',
              },
              {
                title: 'Show the integration',
                body: 'In your code or in your live demo. A judge should be able to point at the call and see the result.',
              },
              {
                title: 'A working demo',
                body: 'Something the room can try, plus a concise explanation of the problem, your approach, and what Gemma contributed.',
              },
            ],
          },
        ],
      },
      {
        id: 'data',
        eyebrow: 'Build faster',
        title: 'Synthetic data',
        accent: 'from Great Data Labs.',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'No real dataset? No problem. Great Data Labs is an open-source initiative for practical data and AI engineering, and its flagship project great-generator generates schema-driven synthetic data built for realistic engineering workflows - prototype, test and demo without depending on a single production record.',
            ],
          },
          {
            kind: 'cards',
            items: [
              {
                title: 'Schema-driven generation',
                body: 'Describe the shape you need; get data that matches it - no scraping, no privacy review, no waiting.',
              },
              {
                title: 'Relational & domain-oriented',
                body: 'Generate related datasets that behave like a real system - customers with orders, tickets with agents, documents with labels.',
              },
              {
                title: 'Pandas & Spark ready',
                body: 'Drop straight into the workflows you already know, and export to CSV, Parquet or Delta.',
              },
            ],
          },
          {
            kind: 'callout',
            title: 'Great Data Labs · great-generator',
            body:
              'Use it for training examples, eval sets, demo fixtures, or stress-testing a data pipeline before the judges ever see it. It is also a genuine open-source project worth contributing to - issues, examples, docs and PRs all welcome.',
            note: 'github.com/ravikiranpagidi/great-generator · greatdatalabs@proton.me',
          },
        ],
      },
      {
        id: 'judging',
        eyebrow: 'Judging',
        title: 'How the track',
        accent: 'is decided.',
        blocks: [
          {
            kind: 'prose',
            lead: 'The bar, in one line:',
            bullets: [
              'The winning project actually uses a Gemma model through the Gemini API.',
              'The team identifies the model in its README.',
              'The integration is visible in the code or the demonstration.',
              'The demo works and the explanation is clear.',
            ],
          },
          {
            kind: 'prose',
            paragraphs: [
              'All three tracks of this Hack Day are judged against one unified criteria sheet, so your work is measured on the same standard whichever challenge you enter - the checks above are what make a Gemma entry stand out within it.',
            ],
          },
          {
            kind: 'callout',
            title: 'What you win',
            body:
              'Prizes vary by region and available inventory. Depending on the event, the winning team may receive an MLH+DEV branded swag bag, a mechanical keyboard, or a digital gift card - swag bags may include a branded bag, notebook and more. On top of that: the track is announced on stage at this Hack Day.',
          },
        ],
      },
      {
        id: 'resources',
        eyebrow: 'Resources',
        title: 'Get to a prototype',
        accent: 'before lunch.',
        blocks: [
          {
            kind: 'links',
            items: [
              { label: 'Gemma 4 resources', href: 'https://mlh.link/gemma', desc: 'The hub page MLH keeps current for this challenge.' },
              { label: 'Gemma Quickstart', href: 'https://mlh.link/gemma-quickstart', desc: 'First API call to working demo, fastest path.' },
              { label: 'Gemma API docs', href: 'https://mlh.link/gemma-docs', desc: 'Parameters, limits and examples for the Gemini API.' },
              { label: 'Gemma Beginner Guide', href: 'https://mlh.link/gemma-beginnerguide', desc: 'Never used an LLM API? Start here.' },
              { label: 'MLH challenge page', href: 'https://hacktoberfest-handbook.mlh.com/hack-days-partner-modules/partner-challenge-google-gemma', desc: 'The official partner-module brief for Best Use of Gemma 4.' },
              { label: 'great-generator', href: 'https://github.com/ravikiranpagidi/great-generator', desc: 'Synthetic datasets for prototyping, testing and demos.' },
            ],
          },
        ],
      },
      {
        id: 'submit',
        eyebrow: 'Submit',
        title: 'Four steps,',
        accent: 'then demo.',
        blocks: [
          {
            kind: 'steps',
            items: [
              { title: 'Wire up Gemma 4', body: 'A real call to a Gemma model through the Gemini API, doing meaningful work in your project.' },
              { title: 'Write the README', body: 'What you built, how to run it, which Gemma model you used - name it explicitly.' },
              { title: 'One teammate submits', body: 'Through the event\'s OrganizerHQ Challenges page before the deadline, selecting Best Use of Gemma 4 - plus any other challenge you are eligible for.' },
              { title: 'Demo on the floor', body: 'Show the integration, not just the output. Judges will ask which model you called.' },
            ],
          },
        ],
      },
    ],
  },

  'aws': {
    slug: '/tracks/aws',
    number: '03',
    title: 'Best Use of AWS',
    tag: 'AWS Student Builder Group Special',
    accent: '#f5b726',
    accentInk: '#10201d',
    pacColor: '#f5b726',
    deck:
      'Our home track, run by the AWS Student Builder Group at Atria. Any AWS service counts and combining several is encouraged - but the pitch has to prove the service choices were right and show, with real metrics, that the thing scales.',
    partner: {
      name: 'AWS Student Builder Group',
      role: 'Host & track owner',
      line: 'Atria Institute of Technology, Bengaluru',
      links: [
        { label: 'awsatria.tech', href: 'https://awsatria.tech/' },
        { label: 'AWS Free Tier', href: 'https://aws.amazon.com/free/' },
      ],
    },
    facts: [
      { value: 'Any AWS service', label: 'Combining several, encouraged' },
      { value: 'Scalable by design', label: 'Not bolted on at 6 PM' },
      { value: 'Metrics in the pitch', label: 'Numbers, not adjectives' },
      { value: 'Mentors on the floor', label: 'AWS builders all day' },
    ],
    sections: [
      {
        id: 'brief',
        eyebrow: 'The brief',
        title: 'Real, on AWS,',
        accent: 'and ready to grow.',
        deck:
          'This is the bonus challenge we run for our own Hack Day. The strongest AWS-powered entry takes the track - on top of any other challenge it also qualifies for.',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Turn an idea into something real on the AWS ecosystem. The bar is deliberately two-sided: reach for the right services for the job, and be ready to show how the architecture behaves when load arrives. A clever demo that would fall over at 100 users is a demo; a simple demo that scales cleanly is a build.',
            ],
          },
          {
            kind: 'cards',
            items: [
              {
                title: 'At least one real AWS service',
                body: 'Live or deployable from your repo. Something running purely on localhost with no AWS behind it does not enter this track.',
              },
              {
                title: 'More than one, tell the story',
                body: 'Combining services is encouraged - but then the architecture has a story: why each piece, how they talk, where the data sits.',
              },
              {
                title: 'Infrastructure as code, welcome',
                body: 'CDK, CloudFormation or Terraform on AWS. Reproducible infrastructure signals a build that can be handed to someone else.',
              },
              {
                title: 'Stack it with the other tracks',
                body: 'An open-source AI project on Bedrock, or a Gemma prototype deployed behind API Gateway, can win two tracks in one afternoon.',
              },
            ],
          },
        ],
      },
      {
        id: 'services',
        eyebrow: 'Service menu',
        title: 'Pick the right service -',
        accent: 'this list is a map, not a mandate.',
        pacColor: '#f5b726',
        blocks: [
          {
            kind: 'table',
            caption: 'Common pairings by layer - mix and match to fit the problem',
            head: ['Layer', 'Services to consider', 'Reach for these when'],
            rows: [
              ['Compute', 'Lambda, EC2, ECS Fargate, App Runner', 'Event-driven glue goes on Lambda; always-on services or containers go on EC2, Fargate or App Runner.'],
              ['APIs & events', 'API Gateway, EventBridge, SQS / SNS, Step Functions', 'You need a public endpoint, decoupled services, or a multi-step workflow that must not lose work.'],
              ['Data', 'Aurora / RDS, DynamoDB, ElastiCache, OpenSearch', 'Relational joins go to Aurora; single-digit-ms key-value to DynamoDB; hot reads to ElastiCache.'],
              ['Storage & edge', 'S3, EFS, CloudFront, Route 53', 'Every artifact, upload and static asset belongs in S3; put CloudFront in front of anything users fetch repeatedly.'],
              ['AI on AWS', 'Bedrock, SageMaker, Transcribe, Comprehend, Textract', 'You want models or AI APIs inside your architecture rather than bolted on from outside.'],
              ['Identity', 'Cognito, IAM', 'Real users, real permissions. Judges notice when "auth" is a text field.'],
              ['Observability', 'CloudWatch, X-Ray', 'The metrics half of this track lives here - dashboards, alarms, traces.'],
              ['Infrastructure', 'CDK, CloudFormation, Terraform on AWS', 'You want the whole environment rebuildable from a repo in one command.'],
            ],
          },
        ],
      },
      {
        id: 'scale',
        eyebrow: 'The differentiator',
        title: 'Scale it -',
        accent: 'then show the numbers.',
        deck:
          'This is where the track is won. Judges expect an architecture that grows with load, and a pitch that backs the claim with metrics you can point at.',
        blocks: [
          {
            kind: 'cards',
            items: [
              {
                title: 'Design for scale',
                body: 'Managed services over servers you babysit. Stateless compute wherever possible, state in managed data stores, Auto Scaling groups or lambda concurrency instead of a fixed box, and multi-AZ where it matters.',
              },
              {
                title: 'Instrument from the start',
                body: 'A CloudWatch dashboard before the demo: request count, latency (p50 and p95), error rate, and saturation - CPU, memory, queue depth, whatever your bottleneck actually is.',
              },
              {
                title: 'Load test it',
                body: 'Point k6 or Locust at your endpoint before judges do. Capture the before-and-after around an autoscaling event - that graph is worth more than a paragraph of description.',
              },
              {
                title: 'Prove it in the pitch',
                body: 'Sixty seconds of numbers: what scales automatically, what broke under load and how you fixed it, and what it costs per thousand requests. Real measurements beat adjectives every time.',
              },
              {
                title: 'Stay inside budget',
                body: 'Free Tier-eligible services where they fit, a billing budget with an alert, and a teardown plan. Cost awareness is part of architecture, not an afterthought.',
              },
              {
                title: 'Secure the basics',
                body: 'No access keys in the repo, least-privilege IAM, private subnets for data stores. Security hygiene is scored - it takes ten minutes and saves the demo.',
              },
            ],
          },
          {
            kind: 'chips',
            label: 'Metrics judges want to see',
            items: [
              'Requests / second',
              'p50 & p95 latency',
              'Error rate',
              'Autoscaling activity',
              'Queue depth / concurrency',
              'Cost per 1k requests',
            ],
          },
        ],
      },
      {
        id: 'judging',
        eyebrow: 'Judging',
        title: 'How the track',
        accent: 'is decided.',
        blocks: [
          {
            kind: 'cards',
            items: [
              { title: 'Right services & architecture', body: 'Deliberate service choices that fit the problem - not AWS for the sake of AWS. A clear story for why each piece is there.' },
              { title: 'Scalability & metrics evidence', body: 'An architecture that grows with load, plus real numbers in the pitch - latency, throughput, error rate, scaling behaviour.' },
              { title: 'Working demo', body: 'It runs on the day, end to end, and the team can drive it live.' },
              { title: 'Cost & security hygiene', body: 'Free Tier awareness, a budget in place, least-privilege IAM, no secrets in the repo.' },
              { title: 'Pitch clarity', body: 'Problem, approach, architecture, metrics - in that order, inside the time you are given.' },
            ],
          },
          {
            kind: 'prose',
            paragraphs: [
              'All three tracks of this Hack Day are judged against one unified criteria sheet, so every entry is measured on the same standard - the track-specific expectations above are what make an entry stand out within it.',
              'The host selects one winning team: the build that made deliberate AWS choices and can back them with numbers. Any AWS-powered entry also qualifies for the other challenges it meets - one submission, as many tracks as you earn.',
              'Prizes and recognition for this track are confirmed closer to the day and announced on stage at the awards ceremony.',
            ],
          },
        ],
      },
      {
        id: 'resources',
        eyebrow: 'Resources',
        title: 'Learn it Friday,',
        accent: 'demo it Friday.',
        blocks: [
          {
            kind: 'links',
            items: [
              { label: 'AWS Skill Builder', href: 'https://skillbuilder.aws/', desc: 'Free official courses - the fastest way to a first service.' },
              { label: 'Well-Architected Framework', href: 'https://docs.aws.amazon.com/well-architected/', desc: 'How AWS thinks about good architecture, pillar by pillar.' },
              { label: 'CloudWatch dashboards', href: 'https://docs.aws.amazon.com/CloudWatch/latest/monitoring/CloudWatch_Dashboards.html', desc: 'Build the metrics view your pitch will quote.' },
              { label: 'EC2 Auto Scaling', href: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html', desc: 'The core scaling mechanism judges expect you to understand.' },
              { label: 'AWS CDK getting started', href: 'https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html', desc: 'Infrastructure as code, in a language you already write.' },
              { label: 'AWS Free Tier', href: 'https://aws.amazon.com/free/', desc: 'What you can run for free while you build today.' },
            ],
          },
          {
            kind: 'callout',
            title: 'Need data for the demo?',
            body:
              'Great Data Labs\' open-source great-generator produces schema-driven synthetic datasets - relational, domain-oriented, exported as CSV, Parquet or Delta and ready for RDS, DynamoDB or S3. Enough realistic rows to make your load test and your metrics mean something.',
            note: 'github.com/ravikiranpagidi/great-generator · greatdatalabs@proton.me',
          },
        ],
      },
      {
        id: 'submit',
        eyebrow: 'Submit',
        title: 'Four steps,',
        accent: 'then pitch.',
        blocks: [
          {
            kind: 'steps',
            items: [
              { title: 'Deploy on AWS', body: 'At least one real AWS service, running or deployable from your repo, with secrets kept out of git.' },
              { title: 'Build the dashboard', body: 'CloudWatch metrics up before judging: latency, throughput, errors, and your scaling signal.' },
              { title: 'One teammate submits', body: 'Through the event\'s OrganizerHQ Challenges page before the deadline, selecting Best Use of AWS - plus any other challenge you qualify for.' },
              { title: 'Pitch with numbers', body: 'Architecture, then evidence: what scales, what it costs, what it measured under load.' },
            ],
          },
        ],
      },
    ],
  },
};

export const TRACK_PAGE_ORDER = ['open-source-ai', 'gemma-4', 'aws'];
