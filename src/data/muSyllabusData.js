// Official University of Mumbai NEP 2020 Syllabus for B.E. Computer Science & Engineering (AI & ML)
// Semester V & VI Academic Curriculum

import { module1Intro } from '../content/computer-networks/module-1-intro';

export const SEMESTER_DATA = {
  semester: 'Semester V',
  program: 'B.E. Computer Science & Engineering (AI & ML)',
  university: 'University of Mumbai (NEP 2020)',
  academicYear: '2026-27',
  subjects: [
    {
      id: 'cn',
      code: '2165116',
      name: 'Computer Network',
      shortName: 'CN',
      category: 'Program Elective - I',
      credits: 3,
      hours: 45,
      icon: 'globe',
      description: 'Foundational knowledge of computer network architectures, TCP/IP, routing protocols, transport mechanisms, socket programming, and advanced SDN/NFV concepts.',
      modules: [
        module1Intro,
        {
          id: 'cn-mod-2',
          number: 'Module II',
          title: 'Data Link Layer',
          hours: 8,
          co: 'CO2',
          summary: 'Framing, error detection & correction, flow control, and multiple access MAC protocols.',
          concepts: [
            { name: 'DLL Design Issues & Framing', desc: 'Services provided to the network layer, character count, byte stuffing, and bit stuffing.' },
            { name: 'Error Detection & Correction', desc: 'Parity bits, Checksum calculation, Hamming Code (error correction), and Cyclic Redundancy Check (CRC).' },
            { name: 'Flow Control Protocols', desc: 'Unrestricted Simplex, Stop-and-Wait, Sliding Window: Go-Back-N (GBN) and Selective Repeat (SR).' },
            { name: 'Multiple Access Protocols (MAC Sublayer)', desc: 'Pure ALOHA, Slotted ALOHA, CSMA, CSMA/CD (collision detection), CSMA/CA (collision avoidance).' },
            { name: 'IEEE Standards Overview', desc: 'IEEE 802.3 (Ethernet) frame format and IEEE 802.11 (Wi-Fi) architecture.' },
          ],
          selfLearning: 'Demonstration of DLL protocols on Cisco Packet Tracer / simulator.'
        },
        {
          id: 'cn-mod-3',
          number: 'Module III',
          title: 'Network Layer',
          hours: 9,
          co: 'CO3',
          summary: 'Switching, IP addressing (IPv4/IPv6), subnetting, NAT, and dynamic routing algorithms.',
          concepts: [
            { name: 'Switching Techniques', desc: 'Circuit Switching, Message Switching, and Packet Switching (Virtual Circuit vs Datagram).' },
            { name: 'IP Addressing: IPv4 vs IPv6', desc: 'Header formats, address spaces, notation, and transition mechanisms (dual stack, tunneling).' },
            { name: 'Subnetting, Supernetting & CIDR', desc: 'Classless Inter-Domain Routing, subnet masking, network ID, broadcast address calculation.' },
            { name: 'Network Address Translation (NAT) & Private IPs', desc: 'Static NAT, Dynamic NAT, Port Address Translation (PAT) resolving IPv4 exhaustion.' },
            { name: 'Core Network Layer Protocols (ARP, RARP, ICMP, IGMP)', desc: 'Address resolution, ping / traceroute error reporting, and multicast group management.' },
            { name: 'Routing Algorithms: Distance Vector vs Link State', desc: 'Bellman-Ford algorithm, Dijkstra shortest path, and Count-to-Infinity problem.' },
            { name: 'Routing Protocols: RIP, OSPF & BGP', desc: 'Intra-domain routing (RIP using hop count, OSPF using link state) and Inter-domain exterior routing (BGP).' },
          ],
          selfLearning: 'AODV and DSR routing protocols for Ad-Hoc networks.'
        },
        {
          id: 'cn-mod-4',
          number: 'Module IV',
          title: 'Transport Layer',
          hours: 7,
          co: 'CO4',
          summary: 'Process-to-process delivery, socket programming, TCP 3-way handshake, and congestion control.',
          concepts: [
            { name: 'Process-to-Process Delivery & Port Addressing', desc: 'Socket concepts, client-server bindings, and well-known vs ephemeral ports.' },
            { name: 'TCP Connection Management (3-Way Handshake)', desc: 'SYN, SYN-ACK, ACK handshake sequence, connection termination, and TCP state transition diagram.' },
            { name: 'TCP Flow Control & Buffering', desc: 'Sliding window at transport layer, byte-stream delivery, and window advertisement.' },
            { name: 'TCP Congestion Control Algorithms', desc: 'Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery (AIMD).' },
            { name: 'TCP vs UDP Comparison', desc: 'Reliable connection-oriented transmission vs lightweight connectionless datagram streaming.' },
            { name: 'Quality of Service (QoS)', desc: 'Techniques for improving QoS: Leaky Bucket and Token Bucket traffic shaping.' },
          ],
          selfLearning: 'Socket programming in Python/C for simple TCP echo client-server.'
        },
        {
          id: 'cn-mod-5',
          number: 'Module V',
          title: 'Application Layer',
          hours: 4,
          co: 'CO5',
          summary: 'Web architectures, HTTP/HTTPS, DNS hierarchy, email protocols, and remote management.',
          concepts: [
            { name: 'Web & HTTP / HTTPS', desc: 'Request/response methods, persistent connections, status codes, cookies, and web caching.' },
            { name: 'Domain Name System (DNS)', desc: 'DNS hierarchy, root nameservers, authoritative servers, recursive vs iterative queries.' },
            { name: 'Electronic Mail Protocols (SMTP, POP3, IMAP)', desc: 'Message transfer agents, user agents, push vs pull mechanisms, and Webmail.' },
            { name: 'File Transfer & Remote Access (FTP, TELNET, SSH)', desc: 'Control vs data channels in FTP; secure encrypted shell vs plain-text Telnet.' },
            { name: 'Host Configuration & Management (DHCP, SNMP)', desc: 'DORA process for dynamic IP assignment and network device management MIB.' },
          ],
          selfLearning: 'Google Public DNS architecture and DNS-over-HTTPS (DoH).'
        },
        {
          id: 'cn-mod-6',
          number: 'Module VI',
          title: 'Emerging & Advanced Topics',
          hours: 5,
          co: 'CO6',
          summary: 'Software-Defined Networking (SDN), NFV, Virtual Private Networks, and Data Center Networks.',
          concepts: [
            { name: 'Virtual Private Networks (VPN)', desc: 'Tunneling protocols, IPSec, SSL/TLS VPNs, and site-to-site vs remote access models.' },
            { name: 'Software-Defined Networking (SDN)', desc: 'Separation of Control Plane and Data Plane, OpenFlow protocol, and SDN controllers.' },
            { name: 'Network Function Virtualization (NFV)', desc: 'Decoupling network functions from dedicated hardware appliances; advantages in elasticity.' },
            { name: 'Data Center Networks (DCNs) & Fat-Tree Topology', desc: 'Modern data center fabric, bisection bandwidth, leaf-spine architecture, and ECMP routing.' },
          ],
          selfLearning: 'SD-WAN (Software-Defined Wide Area Network) adoption in enterprise cloud routing.'
        },
      ]
    },
    {
      id: 'aisc',
      code: '2165112',
      name: 'Artificial Intelligence & Soft Computing',
      shortName: 'AISC',
      category: 'Major Mandatory',
      credits: 3,
      hours: 45,
      icon: 'cpu',
      description: 'Foundations of intelligent agents, state-space search algorithms, knowledge representation, fuzzy logic inference systems, neural networks, and hybrid ANFIS.',
      modules: [
        {
          id: 'aisc-mod-1',
          number: 'Module I',
          title: 'Introduction to AI & Soft Computing',
          hours: 5,
          co: 'CO1',
          summary: 'AI foundations, intelligent agent PEAS model, and soft vs hard computing paradigms.',
          concepts: [
            { name: 'AI Perspectives & Applications', desc: 'Historical development, Turing test, weak vs strong AI, and modern industrial applications.' },
            { name: 'Intelligent Agents & PEAS Model', desc: 'Performance measures, Environment, Actuators, Sensors; agent types (reflex, goal, utility).' },
            { name: 'Hard Computing vs Soft Computing', desc: 'Exact mathematical modeling vs tolerance for imprecision, uncertainty, and partial truth.' },
            { name: 'Constituents of Soft Computing', desc: 'Neural Networks, Fuzzy Logic, Genetic Algorithms, and probabilistic reasoning synergy.' },
          ],
          selfLearning: 'Recent advances in Generative AI, transformer models, and ethical challenges.'
        },
        {
          id: 'aisc-mod-2',
          number: 'Module II',
          title: 'Solving Problems by Searching',
          hours: 7,
          co: 'CO2',
          summary: 'State space formulation, uninformed and informed heuristic search strategies.',
          concepts: [
            { name: 'State Space Search Formulation', desc: 'Initial state, actions, transition model, goal test, and path cost metrics.' },
            { name: 'Uninformed Search: BFS & DFS', desc: 'Breadth-First Search (completeness, queue) and Depth-First Search (space efficiency, stack).' },
            { name: 'Informed Search: Greedy Best-First & A* Search', desc: 'Evaluation functions f(n) = g(n) + h(n), admissible and consistent heuristics.' },
            { name: 'Local Search: Hill Climbing & Simulated Annealing', desc: 'Local optima, plateaus, ridges, and probabilistic exploration via temperature schedules.' },
          ],
          selfLearning: 'Adversarial search: Mini-max algorithm and Alpha-Beta pruning in game playing.'
        },
        {
          id: 'aisc-mod-3',
          number: 'Module III',
          title: 'Knowledge and Reasoning',
          hours: 7,
          co: 'CO3',
          summary: 'Propositional and First-Order Predicate Logic, inference rules, and handling uncertainty.',
          concepts: [
            { name: 'Propositional Logic (PL)', desc: 'Syntax, truth tables, logical connectives, validity, satisfiability, and CNF conversion.' },
            { name: 'First-Order Predicate Logic (FOPL)', desc: 'Predicates, functions, universal (∀) and existential (∃) quantifiers, FOPL semantics.' },
            { name: 'Inference Rules in FOPL', desc: 'Modus Ponens, Universal Instantiation, Unification algorithm, and Resolution refutation.' },
            { name: 'Forward Chaining vs Backward Chaining', desc: 'Data-driven bottom-up reasoning vs goal-driven top-down hypothesis verification.' },
            { name: 'Handling Uncertain Knowledge', desc: 'Random variables, prior and posterior probabilities, and Bayes Theorem fundamentals.' },
          ],
          selfLearning: 'Ontologies, knowledge graphs, and semantic web reasoning.'
        },
        {
          id: 'aisc-mod-4',
          number: 'Module IV',
          title: 'Fuzzy Set Theory & Inference Systems',
          hours: 7,
          co: 'CO4',
          summary: 'Fuzzy sets, membership functions, fuzzy rules, Mamdani and Sugeno FIS.',
          concepts: [
            { name: 'Fuzzy Sets vs Crisp Sets', desc: 'Characteristic function vs continuous membership values [0, 1], fuzzy set operations.' },
            { name: 'Membership Functions & Features', desc: 'Triangular, trapezoidal, Gaussian membership functions; core, support, and boundary.' },
            { name: 'Fuzzification & Defuzzification', desc: 'Centroid method, Mean of Maxima (MOM), and Bisector defuzzification methods.' },
            { name: 'Fuzzy Inference Systems (FIS)', desc: 'Mamdani FIS vs Sugeno (TSK) FIS comparison, rule aggregation, and defuzzification.' },
          ],
          selfLearning: 'Adaptive fuzzy systems and membership function tuning for washing machines/AC controllers.'
        },
        {
          id: 'aisc-mod-5',
          number: 'Module V',
          title: 'Neural Networks',
          hours: 8,
          co: 'CO5',
          summary: 'Biological vs artificial neurons, Perceptron, Backpropagation, and unsupervised learning.',
          concepts: [
            { name: 'Biological vs Artificial Neuron', desc: 'Dendrites, soma, axon mapping to inputs, weights, summing junction, and activation.' },
            { name: 'McCulloch-Pitts Neuron & Perceptron', desc: 'Binary threshold logic, single-layer perceptron, and linear separability limits (XOR problem).' },
            { name: 'Delta Learning Rule & Gradient Descent', desc: 'Continuous error minimization, learning rate parameters, and weight updates.' },
            { name: 'Multi-Layer Perceptron & Backpropagation', desc: 'Forward pass activation, loss calculation, backward error propagation via chain rule.' },
            { name: 'Unsupervised Neural Learning', desc: 'Hebbian learning, Winner-Take-All, Kohonen Self-Organizing Maps (SOM), and LVQ.' },
          ],
          selfLearning: 'Convolutional Neural Networks (CNN) and Recurrent Neural Networks (RNN) overview.'
        },
        {
          id: 'aisc-mod-6',
          number: 'Module VI',
          title: 'Hybrid Systems (ANFIS)',
          hours: 5,
          co: 'CO6',
          summary: 'Neuro-Fuzzy integration, ANFIS architecture, and real-world hybrid intelligence applications.',
          concepts: [
            { name: 'Introduction to Hybrid Intelligent Systems', desc: 'Combining learning capabilities of ANN with interpretable knowledge representation of Fuzzy Logic.' },
            { name: 'Adaptive Neuro-Fuzzy Inference System (ANFIS)', desc: '5-layer architecture: fuzzification, product, normalized, defuzzification, and output node layers.' },
            { name: 'Hybrid Learning Algorithm in ANFIS', desc: 'Least Squares Estimator (forward pass) combined with Gradient Descent (backward pass).' },
            { name: 'Applications of Hybrid Systems', desc: 'Industrial robotics, non-linear system control, medical diagnostics, and financial forecasting.' },
          ],
          selfLearning: 'Comparative evaluation of standalone Fuzzy, standalone Neural, and Neuro-Fuzzy models.'
        },
      ]
    },
    {
      id: 'asdd',
      code: '2165113',
      name: 'Agile Software Dev & DevOps',
      shortName: 'ASDD',
      category: 'Major Mandatory',
      credits: 3,
      hours: 45,
      icon: 'git',
      description: 'Agile methodologies, Scrum, user stories, sprint planning, test-driven development, automated CI/CD pipelines, Docker, Kubernetes, and monitoring.',
      modules: [
        {
          id: 'asdd-mod-1',
          number: 'Module I',
          title: 'Introduction to Agile & Process Models',
          hours: 6,
          co: 'CO1',
          summary: 'Software engineering framework, SDLC comparison, and the Agile Manifesto.',
          concepts: [
            { name: 'SDLC Process Models', desc: 'Waterfall, Prototyping, RAD, Spiral, and Component-Based Development limitations.' },
            { name: 'Need for Agile & History', desc: 'Coping with volatile requirements, fast time-to-market, and continuous stakeholder feedback.' },
            { name: 'Agile Manifesto: 4 Values & 12 Principles', desc: 'Individuals and interactions over processes and tools; working software over comprehensive docs.' },
            { name: 'Traditional vs Agile Classification', desc: 'Predictive/plan-driven vs adaptive/empirical process control models.' },
          ],
          selfLearning: 'Agile scaling frameworks (SAFe, LeSS) for enterprise software organizations.'
        },
        {
          id: 'asdd-mod-2',
          number: 'Module II',
          title: 'Agile Processes & Frameworks',
          hours: 8,
          co: 'CO2',
          summary: 'Deep dive into Scrum, Extreme Programming (XP), Kanban, and Lean development.',
          concepts: [
            { name: 'Scrum Framework', desc: 'Roles (Product Owner, Scrum Master, Dev Team), Artifacts (Product Backlog, Sprint Backlog, Increment), Ceremonies.' },
            { name: 'Scrum Ceremonies', desc: 'Sprint Planning, Daily Standup (15-min), Sprint Review, and Sprint Retrospective.' },
            { name: 'Extreme Programming (XP)', desc: 'Pair programming, continuous integration, refactoring, small releases, and customer on-site.' },
            { name: 'Kanban Method & Lean Software', desc: 'Visualizing workflow, Work-In-Progress (WIP) limits, lead time, cycle time, and cumulative flow.' },
          ],
          selfLearning: 'Agile tooling: Jira software board setup, sprint configuration, and backlog grooming.'
        },
        {
          id: 'asdd-mod-3',
          number: 'Module III',
          title: 'Agile Requirements & Design',
          hours: 7,
          co: 'CO3',
          summary: 'User stories, story cards, acceptance criteria, and agile design principles.',
          concepts: [
            { name: 'User Stories & Specification Formats', desc: 'As a <role>, I want <goal>, so that <benefit>; INVEST criteria for high-quality stories.' },
            { name: 'Backlog Management & Prioritization', desc: 'Product backlog refinement, MoSCoW prioritization, Kano model, and story mapping.' },
            { name: 'Agile Design & Architecture', desc: 'Symptoms of poor software design (rigidity, fragility, immobility); emergent architecture and evolutionary design.' },
            { name: 'SOLID Principles in Agile', desc: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.' },
          ],
          selfLearning: 'Impact mapping and user journey mapping for modern SaaS products.'
        },
        {
          id: 'asdd-mod-4',
          number: 'Module IV',
          title: 'Agile Planning & Estimation',
          hours: 6,
          co: 'CO4',
          summary: 'Estimation levels, Planning Poker, story points, velocity, and burndown charts.',
          concepts: [
            { name: 'Agile Estimation & Story Points', desc: 'Relative sizing vs time estimates; Fibonacci scale, complexity, effort, and uncertainty.' },
            { name: 'Planning Poker Technique', desc: 'Consensus-based estimation gamification avoiding anchoring bias in engineering teams.' },
            { name: 'Velocity & Capacity Planning', desc: 'Calculating team velocity across sprints and forecasting realistic delivery dates.' },
            { name: 'Sprint Burndown & Burnup Charts', desc: 'Tracking remaining work, scope changes, ideal trend lines, and detecting blockers early.' },
          ],
          selfLearning: 'Monte Carlo simulations for probabilistic release date forecasting.'
        },
        {
          id: 'asdd-mod-5',
          number: 'Module V',
          title: 'Agile Quality Assurance & Testing',
          hours: 6,
          co: 'CO5',
          summary: 'Test-Driven Development (TDD), Behavior-Driven Development (BDD), and automation pyramids.',
          concepts: [
            { name: 'Test-Driven Development (TDD)', desc: 'Red-Green-Refactor cycle, unit testing benefits, and writing testable decoupled code.' },
            { name: 'Test Automation Pyramid', desc: 'Many fast Unit tests, balanced Integration / Service tests, few UI End-to-End tests.' },
            { name: 'Agile Testing Quadrants', desc: 'Technology-facing vs business-facing tests; supporting team vs critiquing the product.' },
            { name: 'Continuous Testing in CI/CD', desc: 'Automating test suites with Selenium, Cypress, JUnit, and Postman API tests.' },
          ],
          selfLearning: 'Behavior-Driven Development (BDD) using Cucumber and Gherkin (Given-When-Then).'
        },
        {
          id: 'asdd-mod-6',
          number: 'Module VI',
          title: 'DevOps Lifecycle & CI/CD Pipelines',
          hours: 6,
          co: 'CO6',
          summary: 'DevOps culture, 7-Cs lifecycle, Jenkins automation, Docker, and Kubernetes.',
          concepts: [
            { name: 'DevOps Principles & Benefits', desc: 'Breaking silos between Dev and Ops, CAMS model (Culture, Automation, Measurement, Sharing).' },
            { name: '7-Cs of DevOps Lifecycle', desc: 'Continuous Planning, Coding, Integration, Testing, Monitoring, Deployment, and Feedback.' },
            { name: 'CI/CD Pipelines (Jenkins / GitHub Actions)', desc: 'Build triggers, artifact generation, automated unit tests, and staging deployments.' },
            { name: 'Containerization & Orchestration (Docker / K8s)', desc: 'Docker images, containers, multi-stage Dockerfiles, Kubernetes pods, and services.' },
          ],
          selfLearning: 'Infrastructure as Code (IaC) with Terraform and DevSecOps security scanning.'
        },
      ]
    },
    {
      id: 'smlds',
      code: '2165111',
      name: 'Statistics for ML & Data Science',
      shortName: 'SMLDS',
      category: 'Major Mandatory',
      credits: 3,
      hours: 45,
      icon: 'bar-chart',
      description: 'Probability distributions, sampling, hypothesis testing, linear/nonlinear regression, classification, dimensionality reduction (PCA), and Bayesian evaluation.',
      modules: [
        {
          id: 'smlds-mod-1',
          number: 'Module I',
          title: 'Statistical Foundations & Sampling',
          hours: 7,
          co: 'CO1',
          summary: 'Data types, descriptive statistics, probability distributions, CLT, and distance metrics.',
          concepts: [
            { name: 'Types of Data & Descriptive Stats', desc: 'Categorical, numerical, ordinal; mean, median, mode, variance, skewness, kurtosis.' },
            { name: 'Probability Distributions in ML', desc: 'Normal (Gaussian), Binomial, Poisson, Exponential, Uniform, Beta, and Gamma distributions.' },
            { name: 'Central Limit Theorem (CLT)', desc: 'Sampling distributions of the sample mean, standard error, and Law of Large Numbers.' },
            { name: 'Distance & Similarity Measures', desc: 'Euclidean distance, Manhattan (L1), Minkowski, and Cosine similarity for vectors.' },
          ],
          selfLearning: 'Exploratory Data Analysis using Python (NumPy, Pandas, Seaborn pairplots).'
        },
        {
          id: 'smlds-mod-2',
          number: 'Module II',
          title: 'Statistical Inference & Resampling',
          hours: 6,
          co: 'CO2',
          summary: 'Point estimates, Maximum Likelihood Estimation (MLE), hypothesis testing, and bootstrapping.',
          concepts: [
            { name: 'Point Estimates & Estimator Properties', desc: 'Bias, variance, Mean Squared Error (MSE), and Method of Moments.' },
            { name: 'Maximum Likelihood Estimation (MLE)', desc: 'Likelihood function, log-likelihood, and parameter estimation for Normal & Bernoulli.' },
            { name: 'Hypothesis Testing: z-test, t-test, ANOVA', desc: 'Null vs alternative hypothesis, Type I/II errors, p-value interpretation, and F-test.' },
            { name: 'Resampling Methods: Bootstrap & Permutation', desc: 'Empirical bootstrap confidence intervals and non-parametric permutation significance.' },
          ],
          selfLearning: 'Monte Carlo simulations for statistical power and sample size estimation.'
        },
        {
          id: 'smlds-mod-3',
          number: 'Module III',
          title: 'Regression Models & Regularization',
          hours: 8,
          co: 'CO3',
          summary: 'Linear regression assumptions, multicollinearity (VIF), Ridge, Lasso, and Elastic Net.',
          concepts: [
            { name: 'Simple & Multiple Linear Regression', desc: 'Ordinary Least Squares (OLS), normal equations, and coefficient interpretation.' },
            { name: 'Model Assumptions & Residual Diagnostics', desc: 'Homoscedasticity, normality of residuals, multicollinearity (VIF), and Cook’s distance.' },
            { name: 'Regularization: Ridge (L2), Lasso (L1), Elastic Net', desc: 'Shrinkage penalties, bias-variance tradeoff, sparsity inducing feature selection.' },
            { name: 'Evaluation Metrics (R², Adjusted R², RMSE, MAE)', desc: 'Explained variance penalty for extra predictors and residual deviation magnitudes.' },
          ],
          selfLearning: 'Polynomial and spline regression implementations in Scikit-Learn.'
        },
        {
          id: 'smlds-mod-4',
          number: 'Module IV',
          title: 'Classification & Supervised Learning',
          hours: 7,
          co: 'CO4',
          summary: 'Logistic regression, Naive Bayes, Decision Trees, SVM, and class imbalance handling.',
          concepts: [
            { name: 'Classification Evaluation Metrics', desc: 'Confusion Matrix, Precision, Recall, F1-Score, ROC curve, and AUC score.' },
            { name: 'Logistic Regression & Odds Ratio', desc: 'Sigmoid activation, logit transformation, maximum likelihood loss, and decision boundaries.' },
            { name: 'Naïve Bayes Classifier', desc: 'Bayes theorem with conditional independence assumption (Gaussian, Multinomial).' },
            { name: 'Decision Trees & Pruning', desc: 'Information Gain, Gini Impurity, entropy, and cost-complexity post-pruning.' },
            { name: 'Handling Imbalanced Data (SMOTE)', desc: 'Synthetic Minority Over-sampling Technique, class weighting, and stratified sampling.' },
          ],
          selfLearning: 'Ensemble methods: Random Forest bagging and Gradient Boosting (XGBoost) overview.'
        },
        {
          id: 'smlds-mod-5',
          number: 'Module V',
          title: 'Unsupervised Learning & PCA',
          hours: 5,
          co: 'CO5',
          summary: 'Principal Component Analysis (PCA), clustering algorithms, and dimensionality reduction.',
          concepts: [
            { name: 'Principal Component Analysis (PCA)', desc: 'Covariance matrix calculation, Eigenvalue decomposition, and explained variance ratio.' },
            { name: 'Clustering: K-Means & Hierarchical', desc: 'Lloyd’s algorithm, elbow method, agglomerative linkage (single, complete, average).' },
            { name: 'DBSCAN Density-Based Clustering', desc: 'Epsilon neighborhood, MinPts, core points, border points, and noise detection.' },
            { name: 'Cluster Validation (Silhouette Score)', desc: 'Cohesion vs separation scores and Davies-Bouldin index for optimal cluster count.' },
          ],
          selfLearning: 't-SNE and UMAP high-dimensional manifold visualization techniques.'
        },
        {
          id: 'smlds-mod-6',
          number: 'Module VI',
          title: 'Model Evaluation, Bayesian Inference & Ethics',
          hours: 6,
          co: 'CO6',
          summary: 'Cross-validation, Bayesian parameter estimation, model interpretability (SHAP/LIME), and fairness.',
          concepts: [
            { name: 'Cross-Validation Strategies', desc: 'k-Fold, Stratified k-Fold, Leave-One-Out (LOOCV), and data leakage prevention.' },
            { name: 'Bayesian Fundamentals (MAP vs MLE)', desc: 'Priors, likelihood, posteriors, and Maximum A Posteriori with conjugate priors.' },
            { name: 'Model Interpretability: SHAP & LIME', desc: 'Shapley values from game theory and Local Interpretable Model-agnostic Explanations.' },
            { name: 'Fairness & Ethical Considerations in ML', desc: 'Demographic parity, equalized odds, algorithmic bias, and differential privacy.' },
          ],
          selfLearning: 'Experiment tracking with MLflow and Weights & Biases (W&B).'
        },
      ]
    },
    {
      id: 'wmad',
      code: '2165114',
      name: 'Web & Mobile App Development',
      shortName: 'WMAD',
      category: 'Program Elective - I',
      credits: 3,
      hours: 45,
      icon: 'smartphone',
      description: 'Full stack web with React, scalable backend microservices with Kotlin & Spring Boot, and cross-platform mobile apps with Flutter & Dart.',
      modules: [
        {
          id: 'wmad-mod-1',
          number: 'Module I',
          title: 'Core Web & Mobile Architecture',
          hours: 3,
          co: 'CO1',
          summary: 'RESTful API principles, MVC / MVVM patterns, and modern development stacks.',
          concepts: [
            { name: 'REST API Principles & Design', desc: 'Statelessness, resource URIs, HTTP verbs (GET, POST, PUT, DELETE), and status codes.' },
            { name: 'Architectural Patterns (MVC & MVVM)', desc: 'Model-View-Controller vs Model-View-ViewModel separation of concerns.' },
            { name: 'Modern Full-Stack Stacks (MERN, MEAN, PERN)', desc: 'Component integration across MongoDB, Express, React, PostgreSQL, and Node.' },
            { name: 'Progressive Web Apps (PWAs)', desc: 'Service workers, web app manifests, caching strategies, and offline capabilities.' },
          ],
          selfLearning: 'Low-code / No-code development architectures and Jamstack.'
        },
        {
          id: 'wmad-mod-2',
          number: 'Module II',
          title: 'Front-End Development with React',
          hours: 7,
          co: 'CO2',
          summary: 'React 19 foundations, JSX, hooks, state management, routing, and component lifecycles.',
          concepts: [
            { name: 'React Foundations, JSX & Virtual DOM', desc: 'Declarative UI programming, reconciliation algorithm, and component hierarchy.' },
            { name: 'Core React Hooks (useState, useEffect, useRef)', desc: 'State preservation, side-effect lifecycle synchronization, and DOM node referencing.' },
            { name: 'Forms, Controlled Components & Validation', desc: 'State-bound input handlers, synthetic events, and custom validation rules.' },
            { name: 'Data Fetching & State Management (Context API / Redux)', desc: 'Centralized store, reducers, actions, and asynchronous data fetching.' },
          ],
          selfLearning: 'Performance profiling using React DevTools and custom hook creation.'
        },
        {
          id: 'wmad-mod-3',
          number: 'Module III',
          title: 'Kotlin Programming Core Concepts',
          hours: 8,
          co: 'CO3',
          summary: 'Kotlin language fundamentals, null safety, lambdas, and functional collection operations.',
          concepts: [
            { name: 'Kotlin Syntax & Null Safety System', desc: 'val vs var, nullable types (?), safe call (?.) and Elvis operator (?:).' },
            { name: 'Functions & Lambdas in Kotlin', desc: 'Single-expression functions, higher-order functions, and trailing lambda syntax.' },
            { name: 'OOP & Data Classes', desc: 'Constructors, inheritance, data classes (auto equals/hashCode/copy), and companion objects.' },
            { name: 'Collections & Functional Operations', desc: 'Immutable vs mutable lists, sets, maps; map, filter, fold, and reduce operations.' },
          ],
          selfLearning: 'WebAssembly (Wasm) and Kotlin Multiplatform (KMP) basics.'
        },
        {
          id: 'wmad-mod-4',
          number: 'Module IV',
          title: 'Kotlin Backend & Microservices',
          hours: 8,
          co: 'CO4',
          summary: 'Spring Boot REST services, JPA database integration, JWT authentication, and coroutines.',
          concepts: [
            { name: 'Spring Boot with Kotlin', desc: 'Dependency injection, controller endpoints (@RestController), and service layers.' },
            { name: 'Database ORM (Hibernate / Spring Data JPA)', desc: 'Entity mapping, repositories, CRUD operations, and transaction management.' },
            { name: 'JWT Authentication & Security', desc: 'Token generation, claims parsing, authorization filters, and role-based access.' },
            { name: 'Kotlin Coroutines for Concurrency', desc: 'Suspend functions, Dispatchers, structured concurrency, and async/await non-blocking I/O.' },
          ],
          selfLearning: 'Ktor lightweight asynchronous framework for microservices.'
        },
        {
          id: 'wmad-mod-5',
          number: 'Module V',
          title: 'Flutter Foundations & Dart',
          hours: 7,
          co: 'CO5',
          summary: 'Dart language fundamentals, Flutter widget tree, layout models, and gestures.',
          concepts: [
            { name: 'Dart Programming Essentials', desc: 'Strong typing, null safety, classes, mixins, and asynchronous programming (Futures, async/await).' },
            { name: 'Flutter Architecture & Widget Tree', desc: 'StatelessWidget vs StatefulWidget, element tree, and render tree execution.' },
            { name: 'Layout Widgets (Row, Column, Stack, ListView)', desc: 'Flex layouts, constraints, padding, expanded, and scrollable view structures.' },
            { name: 'State Management in Flutter (Provider / ScopedModel)', desc: 'InheritedWidget wrapper, ChangeNotifier, and reactive UI rebuilds.' },
          ],
          selfLearning: 'Exploring Flutter engine internals and Skia / Impeller rendering pipeline.'
        },
        {
          id: 'wmad-mod-6',
          number: 'Module VI',
          title: 'Advanced Mobile UI & Firebase Integration',
          hours: 6,
          co: 'CO6',
          summary: 'Custom animations, HTTP REST client, Firebase Authentication, and Firestore database.',
          concepts: [
            { name: 'Custom Animations & Gestures', desc: 'AnimationController, Tween curves, Hero transitions, and GestureDetector.' },
            { name: 'REST API Integration in Flutter', desc: 'http and dio packages, JSON serialization / deserialization with factory constructors.' },
            { name: 'Firebase Authentication & Cloud Firestore', desc: 'Email/password authentication, Firestore collections, real-time snapshot streams.' },
            { name: 'App Deployment Guidelines', desc: 'Building APK / iOS IPA, app signing, permissions, and performance optimization.' },
          ],
          selfLearning: 'AI/ML API integration on mobile devices with TensorFlow Lite.'
        },
      ]
    }
  ]
};
