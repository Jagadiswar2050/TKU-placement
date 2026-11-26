const bcrypt = require('bcryptjs');

class InMemoryStore {
  constructor() {
    this.users = [];
    this.studentProfiles = [];
    this.companyProfiles = [];
    this.jobs = [];
    this.applications = [];
    this.notifications = [];
    this.init();
  }

  async init() {
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('Admin@123', salt);
    const studentPass = await bcrypt.hash('Student@123', salt);
    const companyPass = await bcrypt.hash('Company@123', salt);

    // 1. Admin
    const adminId = '660000000000000000000001';
    this.users.push({
      _id: adminId,
      name: 'Dr. V. K. Sharma (Placement Head)',
      email: 'admin@placement.edu',
      password: adminPass,
      role: 'admin',
      isApproved: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date(),
    });

    // 2. Companies
    const googleId = '660000000000000000000011';
    const googleProfId = '660000000000000000000111';
    this.users.push({
      _id: googleId,
      name: 'Google India',
      email: 'google@careers.com',
      password: companyPass,
      role: 'company',
      isApproved: true,
      createdAt: new Date(),
    });
    this.companyProfiles.push({
      _id: googleProfId,
      user: googleId,
      companyName: 'Google India Pvt Ltd',
      website: 'https://careers.google.com',
      industry: 'Internet & Cloud Technology',
      location: 'Bengaluru / Hyderabad',
      description: 'Google’s mission is to organize the world’s information and make it universally accessible and useful.',
      contactPerson: 'Megha Sen',
      contactEmail: 'megha.recruiter@google.com',
      contactPhone: '+91 98765 43210',
      isVerified: true,
    });

    const msftId = '660000000000000000000012';
    const msftProfId = '660000000000000000000112';
    this.users.push({
      _id: msftId,
      name: 'Microsoft IDC',
      email: 'microsoft@careers.com',
      password: companyPass,
      role: 'company',
      isApproved: true,
      createdAt: new Date(),
    });
    this.companyProfiles.push({
      _id: msftProfId,
      user: msftId,
      companyName: 'Microsoft India Development Center',
      website: 'https://careers.microsoft.com',
      industry: 'Software & Enterprise Platforms',
      location: 'Hyderabad / Noida',
      description: 'Empowering every person and organization on the planet to achieve more.',
      contactPerson: 'Karan Malhotra',
      contactEmail: 'karan.campus@microsoft.com',
      contactPhone: '+91 98234 56789',
      isVerified: true,
    });

    const tcsId = '660000000000000000000013';
    const tcsProfId = '660000000000000000000113';
    this.users.push({
      _id: tcsId,
      name: 'Tata Consultancy Services',
      email: 'tcs@careers.com',
      password: companyPass,
      role: 'company',
      isApproved: true,
      createdAt: new Date(),
    });
    this.companyProfiles.push({
      _id: tcsProfId,
      user: tcsId,
      companyName: 'Tata Consultancy Services (TCS Digital)',
      website: 'https://www.tcs.com',
      industry: 'Consulting & IT Services',
      location: 'Chennai / Pune',
      description: 'Global leader in IT services, consulting & business solutions.',
      contactPerson: 'Suresh Iyer',
      contactEmail: 'suresh.iyer@tcs.com',
      contactPhone: '+91 91234 56780',
      isVerified: true,
    });

    // 3. Students
    // Aarav
    const aaravId = '660000000000000000000021';
    const aaravProfId = '660000000000000000000211';
    this.users.push({
      _id: aaravId,
      name: 'Aarav Sharma',
      email: 'aarav@student.edu',
      password: studentPass,
      role: 'student',
      isApproved: true,
      createdAt: new Date(),
    });
    this.studentProfiles.push({
      _id: aaravProfId,
      user: aaravId,
      rollNumber: '23CS0101',
      branch: 'Computer Science (CSE)',
      cgpa: 8.85,
      tenthPercentage: 92.5,
      twelfthPercentage: 89.0,
      passingYear: 2026,
      activeBacklogs: 0,
      skills: ['React.js', 'Node.js', 'MongoDB', 'Python', 'DSA', 'System Design'],
      phone: '+91 98765 00001',
      bio: 'Full Stack Developer passionate about scalable cloud systems and open-source.',
      githubUrl: 'https://github.com/aarav-sharma-dev',
      linkedinUrl: 'https://linkedin.com/in/aarav-sharma-tech',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Aarav_Sharma_Resume_2026.pdf',
    });

    // Priya (Placed)
    const priyaId = '660000000000000000000022';
    const priyaProfId = '660000000000000000000212';
    this.users.push({
      _id: priyaId,
      name: 'Priya Nair',
      email: 'priya@student.edu',
      password: studentPass,
      role: 'student',
      isApproved: true,
      createdAt: new Date(),
    });
    this.studentProfiles.push({
      _id: priyaProfId,
      user: priyaId,
      rollNumber: '23CS0145',
      branch: 'Computer Science (CSE)',
      cgpa: 9.42,
      tenthPercentage: 96.0,
      twelfthPercentage: 94.5,
      passingYear: 2026,
      activeBacklogs: 0,
      skills: ['C++', 'Distributed Systems', 'Algorithms', 'Go', 'Machine Learning'],
      phone: '+91 98765 00003',
      bio: 'Competitive programmer and researcher in distributed database consistency protocols.',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Priya_Nair_Technical_CV.pdf',
    });

    // Sneha
    const snehaId = '660000000000000000000023';
    const snehaProfId = '660000000000000000000213';
    this.users.push({
      _id: snehaId,
      name: 'Sneha Patel',
      email: 'sneha@student.edu',
      password: studentPass,
      role: 'student',
      isApproved: true,
      createdAt: new Date(),
    });
    this.studentProfiles.push({
      _id: snehaProfId,
      user: snehaId,
      rollNumber: '23IT0204',
      branch: 'Information Technology (IT)',
      cgpa: 7.95,
      tenthPercentage: 88.0,
      twelfthPercentage: 84.5,
      passingYear: 2026,
      activeBacklogs: 0,
      skills: ['Java', 'Spring Boot', 'SQL', 'AWS', 'Docker'],
      phone: '+91 98765 00002',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Sneha_Patel_Resume.pdf',
    });

    // 4. Jobs
    const jobGoogleId = '660000000000000000000301';
    this.jobs.push({
      _id: jobGoogleId,
      company: googleId,
      companyProfile: googleProfId,
      title: 'Associate Software Engineer (Campus 2026)',
      role: 'Software Development',
      description: 'Join Google’s world-class engineering team to build scalable services reaching billions of users worldwide. You will work on problems in distributed systems, web architectures, and high-performance computing.',
      responsibilities: [
        'Design, develop, test, deploy, maintain, and enhance software solutions.',
        'Manage individual project priorities, deadlines, and deliverables.',
        'Collaborate across cross-functional engineering and product groups.',
      ],
      skillsRequired: ['Data Structures', 'Algorithms', 'C++', 'Java', 'Python', 'Distributed Systems'],
      packageLPA: 24.5,
      stipend: '₹75,000 / month',
      jobType: 'Internship + Full-Time',
      location: 'Bengaluru / Hyderabad',
      openingsCount: 6,
      eligibility: {
        minCgpa: 8.0,
        allowedBranches: ['Computer Science (CSE)', 'Information Technology (IT)'],
        maxBacklogs: 0,
        minTenthMarks: 75,
        minTwelfthMarks: 75,
        eligiblePassingYears: [2026],
      },
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'Active',
      createdAt: new Date(),
    });

    const jobMsftId = '660000000000000000000302';
    this.jobs.push({
      _id: jobMsftId,
      company: msftId,
      companyProfile: msftProfId,
      title: 'Cloud & AI Software Engineer',
      role: 'Cloud Engineering',
      description: 'Develop next-generation AI platforms, Azure cloud services, and hyper-scale infrastructure at Microsoft India Development Center.',
      responsibilities: [
        'Build scalable, resilient microservices on Microsoft Azure.',
        'Implement automated CI/CD pipelines and infrastructure as code.',
      ],
      skillsRequired: ['C#', 'TypeScript', 'Azure', 'Node.js', 'Kubernetes'],
      packageLPA: 19.5,
      stipend: '₹60,000 / month',
      jobType: 'Full-Time',
      location: 'Hyderabad / Noida',
      openingsCount: 8,
      eligibility: {
        minCgpa: 7.5,
        allowedBranches: ['Computer Science (CSE)', 'Information Technology (IT)', 'Electronics & Comm (ECE)'],
        maxBacklogs: 0,
        minTenthMarks: 70,
        minTwelfthMarks: 70,
        eligiblePassingYears: [2026],
      },
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: 'Active',
      createdAt: new Date(),
    });

    const jobTcsId = '660000000000000000000303';
    this.jobs.push({
      _id: jobTcsId,
      company: tcsId,
      companyProfile: tcsProfId,
      title: 'TCS Digital - Associate Software Engineer',
      role: 'Full Stack Engineering',
      description: 'Be part of the elite TCS Digital cadre working on cutting-edge technologies like Cloud, AI/ML, Cyber Security, and Enterprise IoT.',
      responsibilities: [
        'Develop enterprise web applications using modern Javascript frameworks.',
        'Participate in agile sprints, daily standups, and code reviews.',
      ],
      skillsRequired: ['JavaScript', 'Python', 'Java', 'SQL', 'React.js'],
      packageLPA: 7.5,
      stipend: '₹28,000 / month',
      jobType: 'Full-Time',
      location: 'Pan India (Chennai / Pune / Hyderabad)',
      openingsCount: 25,
      eligibility: {
        minCgpa: 6.5,
        allowedBranches: [
          'Computer Science (CSE)',
          'Information Technology (IT)',
          'Electronics & Comm (ECE)',
          'Electrical (EEE)',
          'Mechanical (MECH)',
        ],
        maxBacklogs: 1,
        minTenthMarks: 60,
        minTwelfthMarks: 60,
        eligiblePassingYears: [2026],
      },
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Active',
      createdAt: new Date(),
    });

    // 5. Applications
    // Priya selected at Google
    this.applications.push({
      _id: '660000000000000000000401',
      job: jobGoogleId,
      student: priyaId,
      studentProfile: priyaProfId,
      status: 'Selected',
      remarks: 'Outstanding performance in Technical Rounds! Offer letter issued for 24.5 LPA.',
      interviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      resumeSnapshot: { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: 'Priya_Nair_Technical_CV.pdf' },
    });

    // Aarav shortlisted at Microsoft
    this.applications.push({
      _id: '660000000000000000000402',
      job: jobMsftId,
      student: aaravId,
      studentProfile: aaravProfId,
      status: 'Shortlisted',
      remarks: 'Cleared coding assessment. Technical Interview scheduled.',
      interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      resumeSnapshot: { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: 'Aarav_Sharma_Resume_2026.pdf' },
    });

    // Aarav under review at Google
    this.applications.push({
      _id: '660000000000000000000403',
      job: jobGoogleId,
      student: aaravId,
      studentProfile: aaravProfId,
      status: 'Under Review',
      remarks: 'Resume screened. Online assessment link sent.',
      appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      resumeSnapshot: { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: 'Aarav_Sharma_Resume_2026.pdf' },
    });

    // Sneha shortlisted at TCS
    this.applications.push({
      _id: '660000000000000000000404',
      job: jobTcsId,
      student: snehaId,
      studentProfile: snehaProfId,
      status: 'Shortlisted',
      remarks: 'Cleared TCS Digital National Qualifier Test (NQT). Technical interview scheduled.',
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      resumeSnapshot: { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: 'Sneha_Patel_Resume.pdf' },
    });

    // 6. Notifications
    this.notifications.push(
      {
        _id: '660000000000000000000501',
        title: 'Google India Campus Drive 2026 - Online Assessment Link',
        message: 'Eligible CSE & IT students must complete the 90-minute HackerRank coding challenge before Friday 11:59 PM. Please check registered email.',
        type: 'urgent',
        targetRole: 'student',
        senderName: 'Placement Cell',
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: '660000000000000000000502',
        title: 'Microsoft Pre-Placement Talk (PPT) & Q&A Session',
        message: 'Microsoft IDC Campus recruitment team is conducting a virtual briefing session on Microsoft Teams on Thursday at 3:00 PM.',
        type: 'info',
        targetRole: 'student',
        senderName: 'Placement Cell',
        isActive: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        _id: '660000000000000000000503',
        title: 'Hearty Congratulations to Priya Nair (CSE)!',
        message: 'Priya Nair has secured a prestigious offer at Google India as Associate Software Engineer with 24.5 LPA! Proud moment for Team 4 & College.',
        type: 'success',
        targetRole: 'all',
        senderName: 'Principal & Placement Dean',
        isActive: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }
    );
  }
}

const memoryStore = new InMemoryStore();
module.exports = memoryStore;
