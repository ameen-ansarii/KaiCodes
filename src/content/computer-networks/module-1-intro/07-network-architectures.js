export default {
  id: 'cn-1-7-network-architectures',
  number: '07',
  title: 'Network Architectures: Client-Server, Peer-to-Peer & Hybrid',
  syllabusMapping: 'Network Architectures: Client-Server, Peer to Peer, Hybrid',
  summary: 'Structural distribution of tasks and workloads between communicating computing entities across centralized and distributed computing paradigms.',
  
  examWeightage: {
    marks: '5 to 10 Marks',
    frequency: 'Frequently asked in Mumbai University (Compare Client-Server vs Peer-to-Peer Architecture with applications)',
    expectedQuestions: [
      'Differentiate between Client-Server and Peer-to-Peer (P2P) network architectures.',
      'Explain the working and architectural design of a Client-Server system. What is a single point of failure?',
      'Describe Hybrid Network Architecture with a real-world example such as BitTorrent or modern VoIP.'
    ]
  },

  theory: `
### 1. Introduction to Network Architectures
A **Network Architecture** defines the structural relationships, logical organization, and division of computing tasks and storage between communicating network devices.

---

### 2. The Three Fundamental Architectures

#### A. Client-Server Architecture
In a **Client-Server** system, network entities have asymmetric, strictly defined roles:
* **Server**: A high-performance, continuously running host that provides resources, manages data, and listens for service requests on designated port numbers (e.g., Web Server, Database Server, File Server).
* **Client**: An end-user workstation or mobile app that initiates requests to the server, waits for the response, and presents data to the user.
* **Key Characteristics**:
  * **Centralized Management**: User accounts, credentials, and access policies are maintained in a central repository (e.g., Active Directory, LDAP).
  * **Scalability**: Can scale vertically (upgrading server CPU/RAM) or horizontally (using load balancers to distribute traffic across server farms).
  * **Bottleneck & Vulnerability**: The central server is a **single point of failure (SPOF)**; if the server crashes or suffers a DDoS attack, all clients are denied service.

#### B. Peer-to-Peer (P2P) Architecture
In a **Peer-to-Peer** network, there are no dedicated central servers. Every participating node (called a **Peer** or **Servent**) possesses identical capabilities and responsibilities:
* Each peer acts simultaneously as both a **Client** (requesting files) and a **Server** (serving files to other peers).
* **Types**:
  * **Centralized P2P (e.g., Early Napster)**: Central index directory server keeps track of which peer owns which file, but actual file downloads occur directly peer-to-peer.
  * **Pure Decentralized P2P (e.g., Gnutella, early BitTorrent)**: No central index server; peers locate each other using Distributed Hash Tables (DHT) or query flooding.
* **Key Characteristics**:
  * **High Fault Tolerance**: No single point of failure. If several peers drop offline, the remaining swarm continues to share and exchange data.
  * **Resource Multiplication**: As more peers join the network, available upload bandwidth and system capacity increase proportionally.
  * **Security Challenges**: Difficult to enforce centralized security, copyright control, and virus scanning.

#### C. Hybrid Architecture
A **Hybrid Architecture** integrates both Client-Server and Peer-to-Peer paradigms to leverage centralized coordination alongside distributed scalability:
* **How it works**:
  * Central servers handle user authentication, billing, discovery, and coordination (Client-Server control plane).
  * High-bandwidth data transfers, media streaming, and file sharing happen directly between end-user peers (P2P data plane).
* **Real-World Examples**:
  * **BitTorrent**: Central trackers or DHT coordinators index swarms, while file chunks are exchanged peer-to-peer between seeders and leechers.
  * **Skype & Zoom VoIP**: Call setup, user lookup, and presence status are managed centrally; voice/video streams route peer-to-peer whenever direct NAT traversal is possible.
  * **Content Delivery Networks (CDNs)**: Central origin servers distribute cached web content across thousands of edge proxy nodes nearest to the user.

---

### 3. Comparison Matrix: Client-Server vs Peer-to-Peer

| Parameter | Client-Server Architecture | Peer-to-Peer (P2P) Architecture |
| :--- | :--- | :--- |
| **System Control** | **Centralized** — Managed by system administrators on central servers. | **Decentralized** — Distributed equally across all participating peers. |
| **Node Roles** | Asymmetric (Clients only request; Servers only provide). | Symmetric (Every node is both client and server / servent). |
| **Fault Tolerance** | Low (Central server failure brings down entire system). | High (Network survives even if multiple peers leave unexpectedly). |
| **Scalability Limit** | Limited by central server CPU, I/O bandwidth, and database locks. | Expands dynamically; capacity scales as user community grows. |
| **Security & Auditing** | High (Central authentication, access control lists, and firewalls). | Lower (Difficult to verify peer identities and data integrity). |
| **Implementation Cost** | High (Costly server-grade hardware, cooling, and network admin staff). | Low (Runs on existing consumer end-user hardware). |
| **Standard Examples** | World Wide Web (HTTP), Email (SMTP), Corporate ERP systems. | BitTorrent, Blockchain / Bitcoin nodes, IPFS. |
  `,

  keyTakeaways: [
    'Client-Server uses centralized servers providing services to client requesters; vulnerable to Single Point of Failure.',
    'P2P distributes storage and bandwidth across all peers (servents), offering high resilience and auto-scaling capacity.',
    'Hybrid architectures use servers for centralized authentication/indexing and P2P for heavy data transfer.'
  ],

  quiz: [
    {
      id: 'q7-1',
      question: 'What is the primary architectural vulnerability of a centralized Client-Server system?',
      options: [
        'Lack of centralized administrative and security control',
        'The central server represents a Single Point of Failure (SPOF) and potential performance bottleneck',
        'Inability to backup corporate database files centrally',
        'Excessive peer-to-peer collision domains'
      ],
      correctIndex: 1,
      explanation: 'Because clients depend completely on the central server for services and authentication, a server crash or network saturation halts the entire system.'
    },
    {
      id: 'q7-2',
      question: 'What is a participating computer called in a pure Peer-to-Peer (P2P) network?',
      options: ['Mainframe', 'Terminal', 'Servent (Peer acting as both Server & Client)', 'Thin Client'],
      correctIndex: 2,
      explanation: 'In pure P2P networks, every host functions as a "Servent" (Server + Client) simultaneously requesting and sharing resources with neighbors.'
    },
    {
      id: 'q7-3',
      question: 'Which of the following real-world applications is the classic example of a Hybrid Network Architecture?',
      options: [
        'BitTorrent (Central trackers coordinate swarms while payloads transfer peer-to-peer)',
        'Traditional IBM mainframe dumb terminal sessions',
        'Point-to-point RS-232 serial cable link',
        'Offline standalone CAD workstation'
      ],
      correctIndex: 0,
      explanation: 'BitTorrent uses centralized trackers to coordinate peer discovery, while the heavy file segments are transferred directly peer-to-peer.'
    },
    {
      id: 'q7-4',
      question: 'How do network bandwidth dynamics differ between P2P and Client-Server systems as the user population grows?',
      options: [
        'P2P networks crash when more than 100 users join',
        'In Client-Server, added users increase server load and reduce per-user bandwidth; in P2P, each new peer contributes both upload and download capacity',
        'Client-Server systems automatically double in bandwidth with every new client',
        'There is no difference in scaling behaviour'
      ],
      correctIndex: 1,
      explanation: 'P2P architectures exhibit positive network scalability because each downloading peer also acts as an uploader, multiplying available aggregate bandwidth.'
    },
    {
      id: 'q7-5',
      question: 'In modern 3-Tier Enterprise Client-Server architectures, what are the three distinct tiers?',
      options: [
        'Physical Tier, Data Link Tier, and Network Tier',
        'Presentation Tier (UI/Client), Application/Business Logic Tier, and Database Data Tier',
        'Router Tier, Switch Tier, and Firewall Tier',
        'LAN Tier, MAN Tier, and WAN Tier'
      ],
      correctIndex: 1,
      explanation: '3-tier architecture decouples the user interface (browser/app), the application business rules (server logic), and the persistence database for enhanced security and modularity.'
    },
    {
      id: 'q7-6',
      question: 'What characterizes a "Thin Client" in client-server computing?',
      options: [
        'A workstation with liquid nitrogen cooling',
        'A lightweight terminal that performs minimal local processing, relying almost entirely on the server for compute and storage',
        'A computer with less than 1 GB of hard disk space',
        'A client with an unshielded twisted pair network cable'
      ],
      correctIndex: 1,
      explanation: 'Thin clients (such as Citrix or VDI terminals) simply render the screen display and capture keyboard/mouse inputs, while execution occurs on powerful servers.'
    },
    {
      id: 'q7-7',
      question: 'Why is data consistency and centralized backup easier to guarantee in a Client-Server model compared to a P2P network?',
      options: [
        'Because P2P networks delete files automatically every 24 hours',
        'Because all authoritative corporate records and database states reside on dedicated central storage with unified backup policies',
        'Because client-server networks do not use IP packets',
        'Because P2P only supports text files'
      ],
      correctIndex: 1,
      explanation: 'Centralized servers allow database administrators to run automated nightly snapshots, enforce ACID transaction integrity, and implement role-based access control.'
    }
  ]
};

