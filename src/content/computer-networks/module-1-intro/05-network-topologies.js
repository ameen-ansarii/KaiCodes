export default {
  id: 'cn-1-5-network-topologies',
  number: '05',
  title: 'Network Topologies: Mesh, Star, Bus, Ring, Tree & Hybrid',
  syllabusMapping: 'Network Topologies',
  summary: 'Geometric representation and structural configurations of network nodes and links, evaluating fault tolerance, installation complexity, and cabling cost.',
  
  examWeightage: {
    marks: '5 to 10 Marks',
    frequency: 'Asked frequently in Mumbai University exams (Direct question to explain Star, Mesh, and Bus with cable calculations)',
    expectedQuestions: [
      'Define Network Topology. Compare Mesh, Star, Bus, and Ring topologies.',
      'In a fully connected Mesh network with n nodes, derive the formula for the total number of physical duplex links and I/O ports needed.',
      'Explain why Star topology with a central switch is the standard for modern LANs.'
    ]
  },

  theory: `
### 1. Definition of Network Topology
The **Topology** of a network is the geometric arrangement and physical or logical layout of nodes (computers, printers, switches) and connecting communication links in a network.

* **Physical Topology**: How the cables and devices are physically routed in space.
* **Logical Topology**: How data frames flow between devices across physical hardware (e.g., a physical star can behave as a logical bus).

---

### 2. Major Network Topologies

#### A. Mesh Topology
* Every node has a dedicated point-to-point link to every other node in the network.
* **Link Calculation**:
  $$\\text{Number of Duplex Links} = \\frac{n(n-1)}{2}$$
  $$\\text{Number of I/O Ports per Node} = n - 1$$
* **Advantages**:
  * **Zero Traffic Congestion**: Dedicated links carry only traffic between their two endpoints.
  * **Robust & Fault Tolerant**: If one cable fails, only that link is severed; all other communication continues uninterrupted.
  * **High Security & Privacy**: Direct point-to-point communication prevents third-party eavesdropping.
* **Disadvantages**:
  * Prohibitive cabling cost and hardware expense for large numbers of nodes.
  * High installation complexity (impractical for large LANs; used in telecom router backbones).

#### B. Star Topology
* Every node has a dedicated point-to-point cable connected exclusively to a central controller known as a **Hub or Switch**.
* Nodes do not communicate directly; all traffic passes through the central switch.
* **Cabling Calculation**: Requires exactly $n$ physical cables and $n$ central switch ports for $n$ nodes.
* **Advantages**:
  * **Easy Installation & Reconfiguration**: Adding or moving a workstation requires only one cable to the switch.
  * **Fault Isolation**: If one cable breaks, only that single node goes offline; the remainder of the network operates normally.
* **Disadvantages**:
  * **Single Point of Failure**: If the central switch/hub crashes, the entire network goes down.
  * Requires more total cable length than a linear bus topology.

#### C. Bus Topology
* A multipoint configuration where all network nodes are attached to a single shared central transmission cable called the **Backbone**.
* Nodes connect to the cable via **Drop Cables** and **Taps**.
* Both ends of the backbone cable must be capped with **Terminators** (50-ohm resistors) to absorb signals and prevent reflection interference.
* **Advantages**: Minimal cable consumption, simple and inexpensive for small networks.
* **Disadvantages**:
  * Backbone cable damage breaks the entire network into isolated partitions.
  * Difficult fault detection and troubleshooting.
  * Collisions increase drastically as node count rises (obsolete in modern offices).

#### D. Ring Topology
* Each device is connected directly to exactly two neighboring devices, forming a continuous circular loop.
* Data travels in one fixed direction (unidirectional) using a circulating control frame called a **Token**.
* **Advantages**: Predictable media access delay; no collisions in token ring architectures.
* **Disadvantages**:
  * A break in the cable ring disables the entire network unless a dual counter-rotating ring (FDDI) is used.
  * Adding or removing a node requires temporarily breaking the ring.

#### E. Tree (Hierarchical) Topology
* A variation of the star topology where central switches are connected in a hierarchical tree pattern.
* Groups of star networks are connected to secondary hubs, which connect to a primary root switch.
* Highly scalable and standard in multi-story university campus networks.

#### F. Hybrid Topology
* A combination of two or more distinct topologies (e.g., Star-Bus or Star-Ring).
* Standard in real-world organizations where individual department rooms use star topology, and department switches are interconnected via a high-speed fiber-optic backbone ring.

---

### 3. Comparison Matrix of Topologies

| Topology | Cable Length Required | Cost | Fault Tolerance | Installation Complexity | Primary Modern Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mesh** | $O(n^2)$ — Maximum | Highest | Maximum (Redundant paths) | Very Difficult | Core Router Internet Backbones |
| **Star** | $O(n)$ — Moderate | Moderate | High (Isolated link breaks) | Easy | **Modern Ethernet LANs & Offices** |
| **Bus** | $O(1)$ — Minimum | Lowest | Low (Backbone break halts all) | Easy | Legacy networks, simple sensor buses |
| **Ring** | $O(n)$ — Moderate | Moderate | Low (Single break halts all) | Moderate | FDDI, MAN Metro Rings (SONET) |
| **Tree** | $O(n \\log n)$ | Moderate to High | High | Moderate | Multi-building Enterprise Campuses |
  `,

  keyTakeaways: [
    'Fully connected mesh of n nodes requires n(n-1)/2 links and n-1 ports per node.',
    'Star topology with an active switch is the worldwide standard for modern Ethernet LANs.',
    'Bus uses a shared backbone with terminators at both ends to absorb reflections.',
    'Hybrid topology blends multiple structures to achieve optimal scalability and fault tolerance.'
  ],

  quiz: [
    {
      id: 'q5-1',
      question: 'In a fully connected Mesh network with n = 8 computers, how many total duplex physical links are required?',
      options: ['28 links', '56 links', '8 links', '16 links'],
      correctIndex: 0,
      explanation: 'Using the formula n(n - 1) / 2: 8 × 7 / 2 = 28 dedicated full-duplex links.'
    },
    {
      id: 'q5-2',
      question: 'Why are 50-ohm terminators installed at both ends of a Bus topology backbone coaxial cable?',
      options: [
        'To supply electrical operating current to connected workstations',
        'To absorb electrical signal reflections and prevent destructive wave bounce',
        'To amplify the signal over long distances like a repeater',
        'To act as a central network gateway'
      ],
      correctIndex: 1,
      explanation: 'When electrical signals reach an open cable termination, they bounce back in reverse phase and corrupt transmitting frames. Terminators absorb this energy.'
    },
    {
      id: 'q5-3',
      question: 'What is the primary architectural vulnerability of a Star topology network?',
      options: [
        'A single cable cut to one PC disables the entire office',
        'The central hub/switch represents a Single Point of Failure (SPOF)',
        'Extremely high collision rates in switched full-duplex mode',
        'Inability to add or move nodes easily'
      ],
      correctIndex: 1,
      explanation: 'All node communication passes through the central switch. If that switch fails or loses power, all attached workstations are isolated.'
    },
    {
      id: 'q5-4',
      question: 'How many network interface ports does EACH individual device require in a fully connected mesh network of n nodes?',
      options: ['1 port', 'n ports', 'n - 1 ports', 'n(n - 1) ports'],
      correctIndex: 2,
      explanation: 'Each computer must connect dedicated cables to every other node in the network, requiring (n - 1) hardware NIC ports per node.'
    },
    {
      id: 'q5-5',
      question: 'In a Ring topology, how is the right to transmit data arbitrated to prevent frame collisions?',
      options: [
        'By random CSMA/CD backoff timers',
        'Using a special 3-byte circulating frame called a Token',
        'By sending all frames to a master root switch first',
        'Through frequency division multiplexing (FDM)'
      ],
      correctIndex: 1,
      explanation: 'In Token Ring and FDDI, a unique permission token circulates continuously. Only the station currently holding the token is allowed to transmit.'
    },
    {
      id: 'q5-6',
      question: 'Which network topology forms the architectural foundation for hierarchical enterprise networks (Core, Distribution, Access layers)?',
      options: ['Bus Topology', 'Ring Topology', 'Tree (Hierarchical Star) Topology', 'Mesh Topology only'],
      correctIndex: 2,
      explanation: 'Tree topology cascades multiple star switches in hierarchical tiers, making it the de-facto standard for university campuses and corporate networks.'
    },
    {
      id: 'q5-7',
      question: 'Which topology provides the easiest fault isolation and cable management for local enterprise offices?',
      options: ['Bus Topology', 'Star Topology', 'Ring Topology', 'Daisy-Chain Topology'],
      correctIndex: 1,
      explanation: 'In Star topology, each workstation has an independent home-run cable back to the patch panel. If one cable fails, only that single workstation is affected.'
    }
  ]
};

