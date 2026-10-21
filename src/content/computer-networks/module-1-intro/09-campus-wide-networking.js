export default {
  id: 'cn-1-9-campus-wide-networking',
  number: '09',
  title: 'Campus-Wide Networking Architecture & Hierarchical Design',
  syllabusMapping: 'Self-learning Topics: Study of Campus wide networking',
  summary: 'Enterprise hierarchical design principles for university campuses, covering Core, Distribution, and Access layers, VLAN segmentation, and perimeter security.',
  
  examWeightage: {
    marks: '5 Marks',
    frequency: 'Common Self-Learning Question in Mumbai University (Design a campus-wide network for an engineering institute with neat topology diagram)',
    expectedQuestions: [
      'Explain the Cisco Three-Tier Hierarchical Campus Network design: Core, Distribution, and Access layers.',
      'How does VLAN segmentation enhance security and traffic management in a university campus network?',
      'Explain the role of a Demilitarized Zone (DMZ) and Wireless LAN Controllers (WLC) in an educational institution.'
    ]
  },

  theory: `
### 1. What is a Campus-Wide Network (CWN)?
A **Campus-Wide Network (CWN)** is an enterprise autonomous network interconnecting multiple academic departments, computer laboratories, administrative offices, central libraries, and hostels across a university compound.

To ensure high availability, fault tolerance, and easy manageability, modern campus networks follow the **Cisco Three-Tier Hierarchical Model**:

\`\`\`
       [ Internet / ISP Edge Gateway & Firewall ]
                          │
            ┌─────────────┴─────────────┐
            │   CORE LAYER (Backbone)   │  <- 40/100 Gbps High-Speed Fiber
            └─────────────┬─────────────┘
          ┌───────────────┴───────────────┐
   ┌──────┴──────┐                 ┌──────┴──────┐
   │DISTRIBUTION │                 │DISTRIBUTION │  <- VLAN Routing & Access Control
   └──────┬──────┘                 └──────┬──────┘
    ┌─────┴─────┐                   ┌─────┴─────┐
 ┌──┴──┐     ┌──┴──┐             ┌──┴──┐     ┌──┴──┐
 │ACC. │     │ACC. │             │ACC. │     │ACC. │ <- End Devices & Wi-Fi APs
 └─────┘     └─────┘             └─────┘     └─────┘
 Computer     Library             Admin       Hostel
 Lab A        Floor 2             Office      Block
\`\`\`

---

### 2. The Three-Tier Architecture Layers

#### A. Core Layer (High-Speed Backbone)
* **Purpose**: Transports massive volumes of aggregate data between distribution buildings at maximum speed with minimal latency.
* **Characteristics**:
  * Employs high-capacity redundant 10 Gbps / 40 Gbps / 100 Gbps single-mode optical fiber links.
  * **No packet filtering, access control lists (ACLs), or deep inspection** is performed here to prevent processing bottlenecks.
  * Designed for $99.999\\%$ uptime with redundant power supplies and link aggregation (LACP).

#### B. Distribution Layer (Policy & Routing Control)
* **Purpose**: The boundary interface between the campus backbone and department access switches.
* **Key Functions**:
  * **Inter-VLAN Routing**: Routes packets between different college departments (e.g., Computer Science VLAN to Mechanical Engineering VLAN).
  * **Security Enforcement**: Implements Access Control Lists (ACLs) preventing unauthorized student access to faculty exam servers.
  * **Broadcast Isolation**: Terminates broadcast domains and aggregates traffic upward to the core.

#### C. Access Layer (User Edge Connectivity)
* **Purpose**: Grants end-user devices (desktop workstations, smart classroom projectors, VoIP phones, Wi-Fi access points) entrance into the network.
* **Key Functions**:
  * **Port Security**: Locks down switch ports to registered hardware MAC addresses.
  * **PoE (Power over Ethernet)**: Powers ceiling-mounted Wi-Fi access points and IP cameras via standard Ethernet cables.
  * **VLAN Assignment**: Maps physical switch ports to appropriate virtual subnets.

---

### 3. Key Campus Infrastructure Components

#### A. Virtual LANs (VLAN Segmentation - IEEE 802.1Q)
* Dividing a physical switch infrastructure into logically isolated broadcast domains:
  * **VLAN 10**: Computer Science Student Labs
  * **VLAN 20**: Faculty & Department Staff
  * **VLAN 30**: University Examination & Grading Servers (Strictly Isolated)
  * **VLAN 40**: Guest / Campus Wi-Fi

#### B. Wireless LAN Controller (WLC) & Enterprise Wi-Fi
* Instead of configuring individual standalone routers, campus networks use **Lightweight Access Points (LWAPs)** managed centrally by a **Wireless LAN Controller (WLC)** using the CAPWAP protocol.
* Enables seamless roaming without session drops as students walk between buildings.

#### C. Demilitarized Zone (DMZ) Perimeter Security
* A buffer subnet positioned between the untrusted public Internet and the secure internal college intranet.
* Hosts public-facing services (University Web Portal, Student ERP, Online Result Server) behind an enterprise Next-Gen Firewall (NGFW). If a web server in the DMZ is compromised, the attacker cannot penetrate the internal university database.
  `,

  keyTakeaways: [
    'Campus networks use a 3-tier hierarchy: Core (speed), Distribution (policy/routing), Access (user connectivity).',
    'Core layer avoids packet inspection to maintain wire-speed throughput.',
    'VLANs isolate sensitive exam/faculty networks from general student lab traffic.',
    'DMZ protects public-facing college web servers while shielding internal databases.'
  ],

  quiz: [
    {
      id: 'q9-1',
      question: 'In the Cisco Three-Tier Hierarchical Campus Model, what is the primary mandate of the Core Layer?',
      options: [
        'Enforcing packet inspection and complex Access Control Lists (ACLs)',
        'Uncompromised wire-speed transport without CPU processing bottlenecks or packet filtering',
        'Direct physical connection to student laptops and lab workstations',
        'Serving as the default DHCP server for mobile phones'
      ],
      correctIndex: 1,
      explanation: 'The Core Layer is strictly optimized for raw speed and redundant backbone transit, deliberately avoiding CPU-intensive packet inspection or ACL filtering.'
    },
    {
      id: 'q9-2',
      question: 'Which hierarchical campus layer handles Inter-VLAN routing, boundary security policies, and department aggregation?',
      options: ['Core Layer', 'Distribution / Aggregation Layer', 'Access Layer', 'Physical Media Layer'],
      correctIndex: 1,
      explanation: 'The Distribution Layer routes traffic between separate departmental VLANs (e.g. Student Lab VLAN to Faculty Server VLAN) and enforces security policies.'
    },
    {
      id: 'q9-3',
      question: 'What is the purpose of a Demilitarized Zone (DMZ) in an enterprise university network architecture?',
      options: [
        'To host high-speed student gaming servers outside the campus proxy',
        'To shield private internal databases and student records by isolating public-facing servers (ERP, Web Portal) behind firewall perimeters',
        'To store backup fiber optic spools in physical vaults',
        'To bridge analog campus security walkie-talkies'
      ],
      correctIndex: 1,
      explanation: 'A DMZ acts as an isolated perimeter buffer; if a public-facing web server is compromised by an external hacker, the attacker is still locked out of the internal database network.'
    },
    {
      id: 'q9-4',
      question: 'Why do campus network engineers segment departments into separate Virtual LANs (VLANs)?',
      options: [
        'To force everyone to use the same IP address',
        'To contain broadcast traffic, improve security between student labs and exam offices, and optimize bandwidth without new physical cabling',
        'To prevent computers from using the Internet',
        'To reduce electric power consumption of switches'
      ],
      correctIndex: 1,
      explanation: 'VLANs logically partition a physical switch into multiple isolated broadcast domains, preventing student sniffing and isolating broadcast storms.'
    },
    {
      id: 'q9-5',
      question: 'Which IEEE standard enables switches to pass electrical power alongside data over standard Cat6 twisted-pair cables to Wireless APs and VoIP phones?',
      options: ['IEEE 802.1Q', 'IEEE 802.3af / 802.3at (Power over Ethernet - PoE)', 'IEEE 802.11ax', 'IEEE 802.1D'],
      correctIndex: 1,
      explanation: 'Power over Ethernet (PoE) delivers DC operating voltage across unused or data copper pairs, eliminating the need for AC electrical wall outlets near ceiling-mounted APs.'
    },
    {
      id: 'q9-6',
      question: 'What is the "Collapsed Core" design pattern often deployed in smaller university buildings or institutes?',
      options: [
        'Removing all switches and using only Wi-Fi',
        'Merging the Core and Distribution layers into a single pair of redundant multilayer switches to save hardware costs',
        'Connecting all workstations in a physical bus topology',
        'Disabling routing protocols completely'
      ],
      correctIndex: 1,
      explanation: 'In smaller campus sites where a dedicated standalone core is cost-prohibitive, the Core and Distribution functions are combined into a single switch pair.'
    },
    {
      id: 'q9-7',
      question: 'How do centralized Wireless LAN Controllers (WLC) improve enterprise Wi-Fi across large university campuses?',
      options: [
        'By turning off Wi-Fi after 6 PM automatically',
        'By managing radio frequencies, channel allocations, and enabling seamless student roaming between buildings without dropping connections',
        'By converting wireless signals into optical laser beams directly in the air',
        'By restricting each student to 5 megabytes per day'
      ],
      correctIndex: 1,
      explanation: 'A centralized WLC dynamically coordinates Lightweight Access Points (LWAPs), balancing RF channels and handling fast BSS transition roaming between academic blocks.'
    }
  ]
};

