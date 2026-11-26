const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const CompanyProfile = require('./models/CompanyProfile');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_portal';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully for seeding.');

    console.log('Clearing old placement data...');
    await Promise.all([
      User.deleteMany(),
      StudentProfile.deleteMany(),
      CompanyProfile.deleteMany(),
      Job.deleteMany(),
      Application.deleteMany(),
      Notification.deleteMany(),
    ]);

    console.log('Seeding Placement Admin account...');
    const admin = await User.create({
      name: 'Dr. V. K. Sharma (Placement Head)',
      email: 'admin@placement.edu',
      password: 'Admin@123',
      role: 'admin',
      isApproved: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    console.log('Seeding Companies...');
    const salt = await bcrypt.genSalt(10);
    const companyPassword = 'Company@123';

    // Google
    const googleUser = await User.create({
      name: 'Google India',
      email: 'google@careers.com',
      password: companyPassword,
      role: 'company',
      isApproved: true,
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    });
    const googleProfile = await CompanyProfile.create({
      user: googleUser._id,
      companyName: 'Google India Pvt Ltd',
      website: 'https://careers.google.com',
      industry: 'Internet & Cloud Technology',
      location: 'Bengaluru / Hyderabad',
      description: 'Google’s mission is to organize the world’s information and make it universally accessible and useful.',
      contactPerson: 'Megha Sen (University Recruiter)',
      contactEmail: 'megha.recruiter@google.com',
      contactPhone: '+91 98765 43210',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      isVerified: true,
    });

    // Microsoft
    const msftUser = await User.create({
      name: 'Microsoft IDC',
      email: 'microsoft@careers.com',
      password: companyPassword,
      role: 'company',
      isApproved: true,
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    });
    const msftProfile = await CompanyProfile.create({
      user: msftUser._id,
      companyName: 'Microsoft India Development Center',
      website: 'https://careers.microsoft.com',
      industry: 'Software & Enterprise Platforms',
      location: 'Hyderabad / Noida / Remote',
      description: 'Empowering every person and every organization on the planet to achieve more.',
      contactPerson: 'Karan Malhotra (Campus Lead)',
      contactEmail: 'karan.campus@microsoft.com',
      contactPhone: '+91 98234 56789',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      isVerified: true,
    });

    // TCS
    const tcsUser = await User.create({
      name: 'Tata Consultancy Services',
      email: 'tcs@careers.com',
      password: companyPassword,
      role: 'company',
      isApproved: true,
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
    });
    const tcsProfile = await CompanyProfile.create({
      user: tcsUser._id,
      companyName: 'Tata Consultancy Services (TCS Digital)',
      website: 'https://www.tcs.com',
      industry: 'Consulting & IT Services',
      location: 'Chennai / Pune / Mumbai',
      description: 'A global leader in IT services, consulting & business solutions partnering with many of the world’s largest businesses.',
      contactPerson: 'Suresh Iyer (Regional Placement Lead)',
      contactEmail: 'suresh.iyer@tcs.com',
      contactPhone: '+91 91234 56780',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
      isVerified: true,
    });

    // Amazon
    const amazonUser = await User.create({
      name: 'Amazon India',
      email: 'amazon@careers.com',
      password: companyPassword,
      role: 'company',
      isApproved: true,
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    });
    const amazonProfile = await CompanyProfile.create({
      user: amazonUser._id,
      companyName: 'Amazon Development Centre',
      website: 'https://amazon.jobs',
      industry: 'E-Commerce & Cloud Computing (AWS)',
      location: 'Bengaluru / Chennai',
      description: 'Earth’s most customer-centric company, where customers can find and discover anything they might want to buy online.',
      contactPerson: 'Anjali Desai (Talent Acquisition)',
      contactEmail: 'desai.anjali@amazon.com',
      contactPhone: '+91 94567 89012',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      isVerified: true,
    });

    console.log('Seeding Students...');
    const studentPassword = 'Student@123';

    // Student 1: Aarav
    const aaravUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@student.edu',
      password: studentPassword,
      role: 'student',
      isApproved: true,
    });
    const aaravProfile = await StudentProfile.create({
      user: aaravUser._id,
      rollNumber: '23CS0101',
      branch: 'Computer Science (CSE)',
      cgpa: 8.85,
      tenthPercentage: 92.5,
      twelfthPercentage: 89.0,
      passingYear: 2026,
      activeBacklogs: 0,
      skills: ['React.js', 'Node.js', 'MongoDB', 'Python', 'Data Structures & Algorithms', 'System Design'],
      phone: '+91 98765 00001',
      bio: 'Enthusiastic Full Stack Developer passionate about scalable cloud systems and open-source contributions.',
      githubUrl: 'https://github.com/aarav-sharma-dev',
      linkedinUrl: 'https://linkedin.com/in/aarav-sharma-tech',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Aarav_Sharma_Resume_2026.pdf',
    });

    // Student 2: Sneha
    const snehaUser = await User.create({
      name: 'Sneha Patel',
      email: 'sneha@student.edu',
      password: studentPassword,
      role: 'student',
      isApproved: true,
    });
    const snehaProfile = await StudentProfile.create({
      user: snehaUser._id,
      rollNumber: '23IT0204',
      branch: 'Information Technology (IT)',
      cgpa: 7.95,
      tenthPercentage: 88.0,
      twelfthPercentage: 84.5,
      passingYear: 2026,
      activeBacklogs: 0,
      skills: ['Java', 'Spring Boot', 'SQL', 'AWS', 'Docker', 'REST APIs'],
      phone: '+91 98765 00002',
      bio: 'Passionate about backend architectures, microservices, and database optimization.',
      githubUrl: 'https://github.com/sneha-patel-it',
      linkedinUrl: 'https://linkedin.com/in/sneha-patel',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Sneha_Patel_Resume.pdf',
    });

    // Student 3: Priya
    const priyaUser = await User.create({
      name: 'Priya Nair',
      email: 'priya@student.edu',
      password: studentPassword,
      role: 'student',
      isApproved: true,
    });
    const priyaProfile = await StudentProfile.create({
      user: priyaUser._id,
      rollNumber: '23CS0145',
      branch: 'Computer Science (CSE)',
      cgpa: 9.42,
      tenthPercentage: 96.0,
      twelfthPercentage: 94.5,
      passingYear: 2026,
      activeBacklogs: 0,
      skills: ['C++', 'Algorithms', 'Distributed Systems', 'Go', 'GraphQL', 'Machine Learning'],
      phone: '+91 98765 00003',
      bio: 'Competitive programmer and researcher in distributed database consistency protocols.',
      githubUrl: 'https://github.com/priya-nair-cse',
      linkedinUrl: 'https://linkedin.com/in/priya-nair',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Priya_Nair_Technical_CV.pdf',
    });

    // Student 4: Rohan
    const rohanUser = await User.create({
      name: 'Rohan Verma',
      email: 'rohan@student.edu',
      password: studentPassword,
      role: 'student',
      isApproved: true,
    });
    const rohanProfile = await StudentProfile.create({
      user: rohanUser._id,
      rollNumber: '23EC0312',
      branch: 'Electronics & Comm (ECE)',
      cgpa: 7.2,
      tenthPercentage: 81.0,
      twelfthPercentage: 78.0,
      passingYear: 2026,
      activeBacklogs: 0,
      skills: ['Embedded C', 'IoT', 'Python', 'Digital Signal Processing', 'Verilog'],
      phone: '+91 98765 00004',
      bio: 'ECE enthusiast with strong interest in IoT applications, microcontrollers, and firmware development.',
      githubUrl: 'https://github.com/rohan-verma-ece',
      linkedinUrl: 'https://linkedin.com/in/rohan-verma',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Rohan_Verma_Resume.pdf',
    });

    // Student 5: Vikram
    const vikramUser = await User.create({
      name: 'Vikram Singh',
      email: 'vikram@student.edu',
      password: studentPassword,
      role: 'student',
      isApproved: true,
    });
    const vikramProfile = await StudentProfile.create({
      user: vikramUser._id,
      rollNumber: '23ME0408',
      branch: 'Mechanical (MECH)',
      cgpa: 6.85,
      tenthPercentage: 79.0,
      twelfthPercentage: 75.0,
      passingYear: 2026,
      activeBacklogs: 1,
      skills: ['AutoCAD', 'SolidWorks', 'Python for Engineers', 'MATLAB', 'Finite Element Analysis'],
      phone: '+91 98765 00005',
      bio: 'Mechanical engineer with passion for product design, CAD automation, and computational analysis.',
      githubUrl: 'https://github.com/vikram-singh-mech',
      linkedinUrl: 'https://linkedin.com/in/vikram-singh',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Vikram_Singh_Resume.pdf',
    });

    console.log('Seeding Job Drives...');
    const nextMonth = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000);
    const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // Job 1: Google Software Engineer
    const jobGoogle = await Job.create({
      company: googleUser._id,
      companyProfile: googleProfile._id,
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
      stipend: '₹75,000 / month during internship',
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
      deadline: nextMonth,
      status: 'Active',
    });

    // Job 2: Microsoft Cloud Solution Specialist
    const jobMsft = await Job.create({
      company: msftUser._id,
      companyProfile: msftProfile._id,
      title: 'Cloud & AI Software Engineer',
      role: 'Cloud Engineering',
      description: 'Develop next-generation AI platforms, Azure cloud services, and hyper-scale infrastructure at Microsoft India Development Center.',
      responsibilities: [
        'Build scalable, resilient microservices on Microsoft Azure.',
        'Implement automated CI/CD pipelines and infrastructure as code.',
        'Optimize low-latency APIs and serverless workflows.',
      ],
      skillsRequired: ['C#', 'TypeScript', 'Azure', 'Node.js', 'Kubernetes', 'REST APIs'],
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
      deadline: inTwoWeeks,
      status: 'Active',
    });

    // Job 3: Amazon Systems Dev Engineer
    const jobAmazon = await Job.create({
      company: amazonUser._id,
      companyProfile: amazonProfile._id,
      title: 'Systems Development Engineer (SDE-1)',
      role: 'Full Stack & Cloud',
      description: 'Invent and simplify high-volume fulfillment services and AWS backend platforms. Solve complex algorithmic challenges and design fault-tolerant systems.',
      responsibilities: [
        'Build end-to-end features for customer-facing systems.',
        'Write robust unit, integration, and performance tests.',
        'Maintain operational excellence and low system latencies.',
      ],
      skillsRequired: ['Java', 'AWS', 'DynamoDB', 'Microservices', 'Git'],
      packageLPA: 16.0,
      stipend: '₹50,000 / month',
      jobType: 'Full-Time',
      location: 'Bengaluru',
      openingsCount: 10,
      eligibility: {
        minCgpa: 7.0,
        allowedBranches: ['Computer Science (CSE)', 'Information Technology (IT)', 'Electronics & Comm (ECE)', 'Electrical (EEE)'],
        maxBacklogs: 0,
        minTenthMarks: 65,
        minTwelfthMarks: 65,
        eligiblePassingYears: [2026],
      },
      deadline: nextMonth,
      status: 'Active',
    });

    // Job 4: TCS Digital Developer
    const jobTcs = await Job.create({
      company: tcsUser._id,
      companyProfile: tcsProfile._id,
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
      deadline: nextMonth,
      status: 'Active',
    });

    console.log('Seeding Applications...');
    // Priya selected at Google
    await Application.create({
      job: jobGoogle._id,
      student: priyaUser._id,
      studentProfile: priyaProfile._id,
      status: 'Selected',
      remarks: 'Outstanding performance in Technical Rounds and System Design! Offer letter issued for 24.5 LPA.',
      interviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      resumeSnapshot: {
        url: priyaProfile.resumeUrl,
        fileName: priyaProfile.resumeOriginalName,
      },
    });

    // Aarav shortlisted at Microsoft
    await Application.create({
      job: jobMsft._id,
      student: aaravUser._id,
      studentProfile: aaravProfile._id,
      status: 'Shortlisted',
      remarks: 'Cleared coding assessment. Technical Interview scheduled.',
      interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      resumeSnapshot: {
        url: aaravProfile.resumeUrl,
        fileName: aaravProfile.resumeOriginalName,
      },
    });

    // Aarav applied at Google
    await Application.create({
      job: jobGoogle._id,
      student: aaravUser._id,
      studentProfile: aaravProfile._id,
      status: 'Under Review',
      remarks: 'Resume screened. Online assessment link sent.',
      resumeSnapshot: {
        url: aaravProfile.resumeUrl,
        fileName: aaravProfile.resumeOriginalName,
      },
    });

    // Sneha shortlisted at TCS Digital
    await Application.create({
      job: jobTcs._id,
      student: snehaUser._id,
      studentProfile: snehaProfile._id,
      status: 'Shortlisted',
      remarks: 'Cleared TCS Digital National Qualifier Test (NQT). Technical interview scheduled.',
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      resumeSnapshot: {
        url: snehaProfile.resumeUrl,
        fileName: snehaProfile.resumeOriginalName,
      },
    });

    // Sneha under review at Amazon
    await Application.create({
      job: jobAmazon._id,
      student: snehaUser._id,
      studentProfile: snehaProfile._id,
      status: 'Under Review',
      remarks: 'Profile meets basic qualifications. Sent for hiring manager review.',
      resumeSnapshot: {
        url: snehaProfile.resumeUrl,
        fileName: snehaProfile.resumeOriginalName,
      },
    });

    // Rohan applied at TCS
    await Application.create({
      job: jobTcs._id,
      student: rohanUser._id,
      studentProfile: rohanProfile._id,
      status: 'Applied',
      remarks: 'Application received and registered for TCS Digital drive.',
      resumeSnapshot: {
        url: rohanProfile.resumeUrl,
        fileName: rohanProfile.resumeOriginalName,
      },
    });

    console.log('Seeding Notifications / Notices...');
    await Notification.create([
      {
        title: 'Google India Campus Drive 2026 - Online Assessment Link',
        message: 'Eligible CSE & IT students must complete the 90-minute HackerRank coding challenge before Friday 11:59 PM. Please check registered email.',
        type: 'urgent',
        targetRole: 'student',
        senderName: 'Placement Cell',
      },
      {
        title: 'Microsoft Pre-Placement Talk (PPT) & Q&A Session',
        message: 'Microsoft IDC Campus recruitment team is conducting a virtual briefing session on Microsoft Teams on Thursday at 3:00 PM.',
        type: 'info',
        targetRole: 'student',
        senderName: 'Placement Cell',
      },
      {
        title: 'Resume Verification Deadline for Batch 2026',
        message: 'All final year students must update their latest CGPA, verified marksheets, and resume on the placement portal by Sunday.',
        type: 'alert',
        targetRole: 'student',
        senderName: 'Placement Cell Office',
      },
      {
        title: 'Hearty Congratulations to Priya Nair (CSE)!',
        message: 'Priya Nair has secured a prestigious offer at Google India as Associate Software Engineer with 24.5 LPA! Proud moment for Team 4 & College.',
        type: 'success',
        targetRole: 'all',
        senderName: 'Principal & Placement Dean',
      },
    ]);

    console.log('======================================================');
    console.log('  PLACEMENT PORTAL DATABASE SEEDING COMPLETE! 🎉');
    console.log('  PROJECT: Placement Portal');
    console.log('  DEVELOPED BY: Team 4 (Students S.No. 23 to 29)');
    console.log('======================================================');
    console.log('DEMO ACCOUNTS READY TO TEST:');
    console.log('1. Admin:   admin@placement.edu      | Pass: Admin@123');
    console.log('2. Student: aarav@student.edu        | Pass: Student@123');
    console.log('3. Student: priya@student.edu        | Pass: Student@123');
    console.log('4. Company: google@careers.com       | Pass: Company@123');
    console.log('5. Company: microsoft@careers.com    | Pass: Company@123');
    console.log('======================================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeder Error:', error);
    process.exit(1);
  }
};

seedData();
