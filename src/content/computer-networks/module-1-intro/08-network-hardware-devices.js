export default {
  id: 'cn-1-8-network-hardware-devices',
  number: '08',
  title: 'Network Interconnecting Devices: Bridge, Switch, Router, Gateway & Access Point',
  syllabusMapping: 'Network Devices: Bridge, Switch, Router, Gateway, Access Point',
  summary: 'Operational principles, OSI layer mapping, collision/broadcast domain separation, and forwarding mechanisms of core networking hardware.',
  
  examWeightage: {
    marks: '10 Marks',
    frequency: 'Extremely high-frequency question in Mumbai University (Compare Bridge, Switch, and Router, or explain Gateway with diagram)',
    expectedQuestions: [
      'Explain the working and functions of Bridge, Switch, Router, and Gateway. State the OSI layer at which each operates.',
      'Differentiate between a Collision Domain and a Broadcast Domain. How do Bridges, Switches, and Routers separate them?',
      'What is a Wireless Access Point (WAP)? Explain its role in bridging wireless and wired networks.'
    ]
  },

  theory: `
### 1. Introduction to Network Interconnecting Devices
Connecting individual computing nodes into local LANs, and interconnecting multiple LANs into wide-area internets, requires specialized physical and logical switching hardware. Each device operates at a specific layer of the OSI protocol stack.

---

### 2. Device Specifications & Operating Principles

#### A. Repeater & Hub (OSI Layer 1: Physical Layer)
* **Repeater**: Regenerates and amplifies attenuated electrical signals over long distances. Operates purely at the bit level; does not inspect or understand packet headers.
* **Hub (Multi-port Repeater)**: Any bit arriving on one port is blindly broadcast to **all other connected ports**.
  * Shares a **single collision domain** and a **single broadcast domain** across all connected devices (highly inefficient).

#### B. Bridge (OSI Layer 2: Data Link Layer)
* Connects two or more LAN segments, filtering traffic based on **48-bit MAC addresses**.
* **Working Mechanism**:
  * Maintains a dynamic **MAC Address Table (Filtering Database)**.
  * When a frame arrives, the bridge reads the Destination MAC address. If the destination resides on the same segment as the sender, the frame is blocked (filtered); if on another segment, it is forwarded.
* **Domain Impact**: **Divides one large collision domain into multiple smaller collision domains**, but keeps a single broadcast domain.

#### C. Switch (OSI Layer 2 & Layer 3: Data Link / Network Layer)
* Essentially a high-speed, hardware-optimized **Multi-port Bridge**.
* Employs specialized **ASIC (Application-Specific Integrated Circuit)** chips to inspect and forward frames concurrently at wire speed.
* **Microsegmentation**: Every single port on a switch forms its own **isolated collision domain** operating in Full-Duplex mode (zero collisions).
* **Switching Methods**:
  * **Store-and-Forward**: Receives the entire frame, checks the CRC checksum for corruption, and forwards only error-free frames.
  * **Cut-Through**: Reads only the first 6 bytes (Destination MAC) and forwards immediately before the rest of the frame has arrived (ultra-low latency, but forwards corrupted frames).

#### D. Router (OSI Layer 3: Network Layer)
* An intelligent internetworking device that forwards data packets across separate logical networks based on **32-bit/128-bit IP addresses**.
* **Working Mechanism**:
  * Maintains a **Routing Table** populated dynamically via routing protocols (OSPF, RIP, BGP) or static configuration.
  * Evaluates packet destination IP against subnet masks to determine the optimal next-hop interface.
* **Domain Impact**: **Separates both Collision Domains AND Broadcast Domains**. Routers block Layer 2 broadcast frames from flooding across networks by default.

#### E. Gateway (OSI Layers 4 to 7: Transport to Application Layer)
* A sophisticated protocol converter that enables communication between two completely **incompatible network architectures or protocol stacks**.
* **Working Mechanism**:
  * Translates data formats, transmission protocols, and addressing schemes from one architecture to another (e.g., translating an enterprise SNA network to TCP/IP, or an email gateway translating SMTP to X.400).
* Decapsulates incoming packets entirely up through higher layers, reconstructs the message payload, and re-encapsulates it according to the target network protocol.

#### F. Access Point (Wireless Access Point - WAP)
* A transceiver device that connects wireless Wi-Fi client stations (laptops, phones) to a wired Ethernet backbone network.
* **Working Mechanism**:
  * Operates at OSI Layers 1 and 2.
  * Converts wireless **IEEE 802.11 RF radio frames** into wired **IEEE 802.3 Ethernet frames** and vice versa.
  * Broadcasts an SSID (Service Set Identifier) and enforces WPA2/WPA3 wireless encryption.

---

### 3. Summary Device Comparison Matrix

| Device | OSI Layer | Primary Addressing Used | Separates Collision Domains? | Separates Broadcast Domains? | Primary Function |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hub / Repeater** | Layer 1 (Physical) | None (Raw electrical bits) | ❌ No (Single collision domain) | ❌ No | Signal regeneration & physical fan-out |
| **Bridge** | Layer 2 (Data Link) | 48-bit MAC Address | ✅ **Yes** (Splits collision domains) | ❌ No | Interconnecting 2 LAN segments |
| **Switch** | Layer 2 (Data Link) | 48-bit MAC Address | ✅ **Yes** (1 collision domain per port) | ❌ No | High-speed multi-port frame switching |
| **Router** | Layer 3 (Network) | 32-bit / 128-bit IP Address | ✅ **Yes** | ✅ **Yes** (Blocks broadcasts) | Packet routing across networks |
| **Gateway** | Layers 4–7 (App/Trans) | Port / Protocol / Syntax | ✅ **Yes** | ✅ **Yes** | Heterogeneous protocol translation |
| **Access Point** | Layers 1 & 2 (Phys/DLL) | 802.11 Radio / MAC | ✅ **Yes** | ❌ No | Bridging wireless nodes to wired Ethernet |
  `,

  keyTakeaways: [
    'Switches create one isolated collision domain per port using MAC tables.',
    'Routers break broadcast domains and route packets using IP routing tables.',
    'Gateways translate protocols between fundamentally incompatible network architectures across Layers 4-7.',
    'WAP translates 802.11 wireless frames to 802.3 wired Ethernet frames.'
  ],

  quiz: [
    {
      id: 'q8-1',
      question: 'Which networking device operates at Layer 3 and separates both Collision Domains AND Broadcast Domains?',
      options: ['Repeater', 'Multi-port Hub', 'Layer 2 Switch', 'Router'],
      correctIndex: 3,
      explanation: 'Routers inspect Layer 3 IP headers and block Layer 2 broadcast frames by default, creating independent broadcast domains.'
    },
    {
      id: 'q8-2',
      question: 'Why does a microsegmented Ethernet Switch dramatically outperform a traditional Hub in a campus LAN?',
      options: [
        'Switches eliminate twisted pair cables completely',
        'Every port on a switch forms its own isolated Collision Domain operating in Full-Duplex',
        'Switches only transmit wireless infrared signals',
        'Switches run analog radio modulations'
      ],
      correctIndex: 1,
      explanation: 'Unlike hubs that blindly broadcast electrical signals out of every port causing collisions, switches look up MAC addresses in CAM tables and forward frames directly to the intended port.'
    },
    {
      id: 'q8-3',
      question: 'Which device is required to interconnect two systems using completely incompatible architectures (e.g., IBM SNA and TCP/IP)?',
      options: ['Application Gateway', 'Repeater', 'Bridge', 'Patch Panel'],
      correctIndex: 0,
      explanation: 'Gateways operate across Layers 4 through 7, translating protocol stacks, payloads, and addressing between completely incompatible systems.'
    },
    {
      id: 'q8-4',
      question: 'At which OSI layer does an unmanaged Ethernet Repeater operate, and what is its primary technical function?',
      options: [
        'Layer 2: Filtering MAC frames',
        'Layer 1: Regenerating and re-timing degraded physical electrical signals to extend link distance',
        'Layer 3: Calculating shortest Dijkstra paths',
        'Layer 4: Buffering TCP segments'
      ],
      correctIndex: 1,
      explanation: 'Repeaters operate at the Physical Layer (Layer 1). They clean up noise and regenerate bit-level electrical waveforms, overcoming attenuation.'
    },
    {
      id: 'q8-5',
      question: 'If a 24-port Layer 2 Switch has 24 workstations plugged in, how many Collision Domains and Broadcast Domains exist?',
      options: [
        '1 Collision Domain, 1 Broadcast Domain',
        '24 Collision Domains, 1 Broadcast Domain',
        '24 Collision Domains, 24 Broadcast Domains',
        '1 Collision Domain, 24 Broadcast Domains'
      ],
      correctIndex: 1,
      explanation: 'Each switch port is an independent Collision Domain (24 total). However, because switches flood broadcast frames (FF:FF:FF:FF:FF:FF), all ports belong to 1 single Broadcast Domain.'
    },
    {
      id: 'q8-6',
      question: 'What is the internal memory table called that a Layer 2 switch builds to associate host MAC addresses with physical ports?',
      options: ['ARP Cache', 'CAM (Content Addressable Memory) / MAC Table', 'Routing Information Base (RIB)', 'DNS Table'],
      correctIndex: 1,
      explanation: 'Switches dynamically learn source MAC addresses from incoming frames and store the port mapping in their hardware CAM table.'
    },
    {
      id: 'q8-7',
      question: 'What protocol translation does a Wireless Access Point (WAP) perform when bridging laptops to an enterprise Ethernet backbone?',
      options: [
        'Translates IEEE 802.11 wireless frames to IEEE 802.3 wired Ethernet frames',
        'Translates IPv4 to IPv6 only',
        'Converts HTTP requests to FTP transfers',
        'Converts digital optical light to analog telephone voice'
      ],
      correctIndex: 0,
      explanation: 'WAPs act as Layer 2 bridges, stripping the 802.11 wireless MAC header and encapsulating the payload into an 802.3 wired Ethernet frame.'
    }
  ]
};

