export const languages = {
  en: 'English',
  vi: 'Tiếng Việt',
};

export type Language = keyof typeof languages;

const envDefaultLang = import.meta.env.PUBLIC_DEFAULT_LANG;
const isValidDefaultLang = envDefaultLang && envDefaultLang in languages;
export const defaultLang = (isValidDefaultLang ? envDefaultLang : 'vi') as Language;

export const ui = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.blogs': 'Blogs',
    'nav.about': 'About Us',
    'nav.faq': 'FAQ',
    'nav.getStarted': 'Get Started',
    'nav.logout': 'Logout',

    // Internal page
    'internal.welcome': 'Welcome back, {username}!',
    'internal.title': 'Team Resources',
    'internal.subtitle': 'Access your team resources and documentation',
    'internal.agile_scrum.title': 'Agile & Scrum Presentation',
    'internal.agile_scrum.description': 'Learn about Agile methodology and Scrum framework with our comprehensive presentation',
    'internal.user_management.title': 'User Management',
    'internal.user_management.description': 'Create and manage user accounts (Admin only)',
    'internal.logout': 'Logout',

    // User Management
    'users.title': 'User Management',
    'users.create_user': 'Create New User',
    'users.username': 'Username',
    'users.password': 'Password',
    'users.role': 'Role',
    'users.role_admin': 'Admin',
    'users.role_user': 'User',
    'users.create': 'Create User',
    'users.cancel': 'Cancel',
    'users.success': 'User created successfully',
    'users.error': 'Error creating user',
    'users.username_exists': 'Username already exists',
    'users.required': 'Username and password are required',
    'users.forbidden': 'Forbidden. Admin access required.',
    'users.list': 'Users List',
    'users.no_users': 'No users found',
    'users.loading': 'Loading users...',
    'users.username_hint': 'Username must end with @slice.com',
    'users.delete': 'Delete User',
    'users.confirm_delete': 'Are you sure you want to delete user',

    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to access your account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Sign In',
    'login.error': 'Invalid username or password',
    'login.required': 'This field is required',



    // Home page - Hero
    'home.badge': "We're building something amazing",
    'home.title': 'Building Apps',
    'home.titleHighlight': 'That Matter',
    'home.description':
      "We're a passionate startup team dedicated to building innovative mobile applications that solve real problems and make a genuine impact in people's lives.",
    'home.meetTeam': 'Meet Our Team',
    'home.readBlog': 'Read Our Blog',

    // Home page - Stats
    'home.stats.users': 'Active Users',
    'home.stats.uptime': 'Uptime',
    'home.stats.support': 'Support',
    'home.stats.rating': 'App Rating',

    // Home page - Features
    'home.features.title': 'Why Choose',
    'home.features.titleHighlight': 'Slice',
    'home.features.subtitle':
      'We combine cutting-edge technology with thoughtful design to create mobile apps that users love.',
    'home.features.fast.title': 'Lightning Fast',
    'home.features.fast.desc': 'We build apps that are optimized for speed and performance from day one.',
    'home.features.user.title': 'User Focused',
    'home.features.user.desc': "Every feature we build starts with understanding our users' needs.",
    'home.features.secure.title': 'Secure & Reliable',
    'home.features.secure.desc': "Security is not an afterthought. It's built into everything we create.",
    'home.features.design.title': 'Beautiful Design',
    'home.features.design.desc': 'We believe great products deserve great design. Every pixel matters.',

    // Home page - Hero cards
    'home.card.mobile': 'Mobile Apps',
    'home.card.platforms': 'iOS & Android',
    'home.card.growing': 'Growing Fast',
    'home.card.growingDesc': 'Scaling with our users',

    // Home page - CTA
    'home.cta.title': 'Ready to Build Something',
    'home.cta.titleHighlight': 'Amazing',
    'home.cta.description':
      'Join thousands of users who are already experiencing the future of mobile app development with Slice.',
    'home.cta.button': 'Get Started Today',
    'home.cta.learnMore': 'Learn More',

    // About page
    'about.badge': 'Meet the Team',
    'about.title': 'The People Behind',
    'about.titleHighlight': 'Slice',
    'about.subtitle': "We're a diverse team of dreamers, builders, and problem-solvers united by our passion for creating technology that makes a real difference.",
    'about.values.title': 'Our',
    'about.values.titleHighlight': 'Values',
    'about.values.subtitle': 'The principles that guide everything we do at Slice.',
    'about.values.innovation.title': 'Innovation First',
    'about.values.innovation.desc': "We push boundaries and challenge the status quo to create solutions that haven't been imagined yet.",
    'about.values.team.title': 'Team Over Ego',
    'about.values.team.desc': 'We succeed together. Every voice matters, and the best ideas win regardless of where they come from.',
    'about.values.user.title': 'User Obsessed',
    'about.values.user.desc': 'Our users are at the heart of everything we do. Their success is our success.',
    'about.cta.title': 'Want to Join Our',
    'about.cta.titleHighlight': 'Team',
    'about.cta.description': "We're always looking for talented individuals who share our passion for building great products.",
    'about.cta.button': 'View Open Positions',

    'about.team.stripeEyebrow': 'Leadership & team',
    'about.team.stripeTitle': 'People behind the product',
    'about.team.stripeSub':
      'Engineering, design, and growth — one team focused on shipping products that matter.',

    // About page - Team members
    'about.team.hieu.bio': 'Full-stack wizard who loves elegant solutions. Believes in code that reads like poetry and building products that matter.',
    'about.team.nhi.bio': 'Strategic marketer with a passion for brand storytelling. Transforms insights into impactful campaigns that resonate.',
    'about.team.hung.bio': 'Visionary marketing leader driving growth and brand awareness. Expert in digital strategies and team leadership.',
    'about.team.son.bio': 'Creative designer crafting pixel-perfect experiences. Design is not just how it looks, but how it works.',
    'about.team.phu.bio': 'Visual storyteller bringing ideas to life. Passionate about creating beautiful and intuitive user interfaces.',

    // Blog page
    'blog.badge': 'Our Blog',
    'blog.title': 'Insights &',
    'blog.titleHighlight': 'Stories',
    'blog.subtitle': 'Thoughts, learnings, and insights from our team on building great products.',
    'blog.readMore': 'Read more',
    'blog.loadMore': 'Load More Articles',
    'blog.newsletter.title': 'Subscribe to Our Newsletter',
    'blog.newsletter.desc': 'Get the latest insights and updates delivered straight to your inbox.',
    'blog.newsletter.placeholder': 'Enter your email',
    'blog.newsletter.button': 'Subscribe',
    'blog.category.all': 'All',
    'blog.category.technology': 'Technology',
    'blog.category.engineering': 'Engineering',
    'blog.category.design': 'Design',
    'blog.category.product': 'Product',
    'blog.category.process': 'Process',

    // FAQ page
    'faq.badge': 'Help Center',
    'faq.title': 'Frequently Asked',
    'faq.titleHighlight': 'Questions',
    'faq.subtitle': 'Find answers to common questions about Slice and our products.',
    'faq.items.what.question': 'What is Slice and what do you do?',
    'faq.items.what.answer':
      'Slice is a startup focused on building innovative native mobile applications for iOS and Android that solve real-world problems. We combine thoughtful design with solid engineering to create products users love.',
    'faq.items.started.question': 'How can I get started with your products?',
    'faq.items.started.answer':
      "Getting started is easy! Download our mobile app, sign up, and you'll have access to our features. We offer a free tier so you can explore before upgrading to a paid plan.",
    'faq.items.custom.question': 'Do you offer custom development services?',
    'faq.items.custom.answer':
      'Yes! We work with businesses of all sizes to build custom mobile applications tailored to their needs. Contact us to discuss your project and get a personalized quote.',
    'faq.items.security.question': 'How do you ensure the security of your applications?',
    'faq.items.security.answer':
      'Security is built into every layer of our development process. We follow industry best practices, conduct regular security audits, and implement encryption for all sensitive data. Your security is our top priority.',
    'faq.items.support.question': 'What kind of support do you provide?',
    'faq.items.support.answer':
      'We offer 24/7 customer support through multiple channels including email, chat, and phone. Our dedicated support team is always ready to help you with any questions or issues.',
    'faq.items.feature.question': 'Can I request new features?',
    'faq.items.feature.answer':
      'Absolutely! We love hearing from our users. You can submit feature requests through our feedback portal, and our product team reviews every suggestion to prioritize our roadmap.',
    'faq.items.mobile.question': 'Do you offer a web or desktop version?',
    'faq.items.mobile.answer':
      'We focus on native mobile apps for iOS and Android. We do not offer a web or desktop client at this time.',
    'faq.cta.title': 'Still Have Questions?',
    'faq.cta.description': "Can't find what you're looking for? Our support team is here to help.",
    'faq.cta.email': 'Email Support',
    'faq.cta.chat': 'Live Chat',

    // Privacy Policy page
    'privacy.badge': 'Legal',
    'privacy.title': 'Privacy Policy',
    'privacy.lastUpdated': 'Last updated: April 22, 2026',
    'privacy.intro': 'Telify ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Telify. This Privacy Policy applies to our mobile application ("Telify") and its associated services.',
    'privacy.sections.information.title': 'Information We Collect',
    'privacy.sections.information.content': 'We collect information you provide directly to us, including: name, email address, phone number, and any other information you choose to provide. We may also collect device information such as device type, operating system, and unique device identifiers.',
    'privacy.sections.usage.title': 'How We Use Your Information',
    'privacy.sections.usage.content': 'We use the information we collect to provide, maintain, and improve our services, communicate with you about our products, and protect our users and services.',
    'privacy.sections.security.title': 'Data Security',
    'privacy.sections.security.content': 'We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet is 100% secure.',
    'privacy.sections.contact.title': 'Contact Us',
    'privacy.sections.contact.content': 'If you have any questions about this Privacy Policy, please contact us at: hieubh130700@gmail.com',
    'privacy.questions': 'Have questions about our privacy practices?',

    // Terms of Service page
    'terms.badge': 'Legal',
    'terms.title': 'Terms of Service',
    'terms.lastUpdated': 'Last updated: April 22, 2026',
    'terms.intro': 'Welcome to Telify, a mobile application designed to help users create reminders, manage personal schedules, and maintain meaningful connections with people they care about. By accessing or using Telify, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.',
    'terms.questions': 'Have questions about our terms?',
    'terms.sections.about.title': 'About Telify',
    'terms.sections.about.content': 'Telify is a digital service that enables users to create, organize, and visualize schedules in a simple and intuitive way. The application allows users to set reminders, arrange events in a chronological timeline, and share selected events with others. Telify integrates artificial intelligence to assist users in generating schedules through natural language input.',
    'terms.sections.eligibility.title': 'Eligibility',
    'terms.sections.eligibility.content': 'Telify is intended for individuals who are at least 13 years of age. By using the application, you confirm that you meet this minimum age requirement. If you are below the legal age of majority in your jurisdiction, you represent that you have obtained consent from a parent or legal guardian.',
    'terms.sections.accounts.title': 'Accounts and Access',
    'terms.sections.accounts.content': 'Telify provides flexible access options. Users may sign in through Apple or Google, or use the application in guest mode without creating an account. Users are responsible for maintaining the security of their device and any associated accounts. Any activity conducted through your access point is considered your responsibility.',
    'terms.sections.use.title': 'Use of the Service',
    'terms.sections.use.content': 'By using Telify, you agree to use the application solely for lawful and appropriate purposes. Any misuse such as sending spam reminders, harassing other users, or sharing harmful or illegal content is strictly prohibited. Users must not attempt to copy, modify, reverse engineer, or otherwise exploit the application beyond its intended use.',
    'terms.sections.content.title': 'Shared Content',
    'terms.sections.content.content': 'Telify allows users to share events and schedules with others. This sharing functionality is limited to view-only access, meaning recipients can see the shared content but cannot modify it. Users are solely responsible for the content they choose to share, and Telify reserves the right to remove any content that violates these Terms.',
    'terms.sections.ai.title': 'Telify AI',
    'terms.sections.ai.content': 'Telify incorporates artificial intelligence features to assist users in creating schedules more efficiently. While the AI is designed to be helpful and accurate, it does not guarantee correctness or completeness in all cases. Users should exercise their own judgment when relying on AI-generated content, and Telify shall not be held responsible for any outcomes resulting from its use.',
    'terms.sections.subscription.title': 'Subscription and Payments',
    'terms.sections.subscription.content': 'Telify offers a subscription-based service known as Telify Premium. Users may be eligible for a free trial period, after which the subscription will automatically renew unless canceled prior to the renewal date. Payments are processed through Apple or Google, and users are responsible for managing their subscriptions.',
    'terms.sections.data.title': 'Data and Privacy',
    'terms.sections.data.content': 'Telify collects and processes certain types of user data, including personal information, device-related information, and usage analytics. This information is used to enhance application performance, understand user behavior, and support AI functionalities. Telify does not display third-party advertisements within the application.',
    'terms.sections.thirdParty.title': 'Third-Party Services',
    'terms.sections.thirdParty.content': 'Telify relies on third-party services, including Google Firebase, for data storage, analytics, and system performance monitoring. While these services are necessary for the operation of the app, they may process user data according to their own policies. Telify does not control these third-party services and is not responsible for their practices.',
    'terms.sections.availability.title': 'Service Availability',
    'terms.sections.availability.content': 'Telify is provided on an "as is" and "as available" basis. While efforts are made to ensure reliability, uninterrupted service cannot be guaranteed. There may be instances where notifications are delayed, features are temporarily unavailable, or errors occur. Users acknowledge that Telify is a supportive tool rather than a guaranteed system.',
    'terms.sections.device.title': 'Device and Connectivity',
    'terms.sections.device.content': 'Certain features of Telify require an active internet connection to function properly. Users are responsible for ensuring that their devices are compatible with the application and that they have adequate connectivity. Any costs associated with data usage are the responsibility of the user.',
    'terms.sections.liability.title': 'Limitation of Liability',
    'terms.sections.liability.content': 'To the fullest extent permitted by applicable law, Telify shall not be held liable for any direct or indirect damages arising from the use or inability to use the application. This includes missed reminders, data loss, or decisions made based on AI-generated suggestions. By using the application, users accept that Telify functions as an assistive tool.',
    'terms.sections.changes.title': 'Changes to the Terms',
    'terms.sections.changes.content': 'Telify reserves the right to update or modify these Terms of Service at any time to reflect changes in the service or legal requirements. Updated versions will be made available within the application. Continued use of Telify after such updates constitutes acceptance of the revised Terms.',
    'terms.sections.termination.title': 'Termination',
    'terms.sections.termination.content': 'Telify may suspend or terminate user access at its discretion if there is a violation of these Terms or any activity that may harm the platform or other users. Users also retain the right to discontinue use of the application at any time. Termination does not affect any rights or obligations that have accrued prior to the termination date.',
    'terms.sections.contact.title': 'Contact',
    'terms.sections.contact.content': 'If you have any questions, concerns, or feedback regarding these Terms of Service, you may contact Telify through email at hieubh130700@gmail.com or through in-app support features.',

    // Footer
    'footer.description': "We're a passionate startup team building innovative apps that make a difference. Join us on our journey to create something amazing.",
    'footer.navigation': 'Navigation',
    'footer.contact': 'Contact',
    'footer.copyright': '© {year} Slice. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',

    // Language switcher
    'lang.switch': 'Language',
  },
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.blogs': 'Blog',
    'nav.about': 'Về chúng tôi',
    'nav.faq': 'Câu hỏi thường gặp',
    'nav.getStarted': 'Bắt đầu',
    'nav.logout': 'Đăng xuất',

    // Internal page
    'internal.welcome': 'Chào mừng trở lại, {username}!',
    'internal.title': 'Tài nguyên nhóm',
    'internal.subtitle': 'Truy cập tài nguyên và tài liệu của nhóm',
    'internal.agile_scrum.title': 'Bài thuyết trình Agile & Scrum',
    'internal.agile_scrum.description': 'Tìm hiểu về phương pháp Agile và framework Scrum với bài thuyết trình toàn diện của chúng tôi',
    'internal.user_management.title': 'Quản lý người dùng',
    'internal.user_management.description': 'Tạo và quản lý tài khoản người dùng (Chỉ dành cho Admin)',
    'internal.logout': 'Đăng xuất',

    // User Management
    'users.title': 'Quản lý người dùng',
    'users.create_user': 'Tạo người dùng mới',
    'users.username': 'Tên đăng nhập',
    'users.password': 'Mật khẩu',
    'users.role': 'Vai trò',
    'users.role_admin': 'Quản trị viên',
    'users.role_user': 'Người dùng',
    'users.create': 'Tạo người dùng',
    'users.cancel': 'Hủy',
    'users.success': 'Tạo người dùng thành công',
    'users.error': 'Lỗi tạo người dùng',
    'users.username_exists': 'Tên đăng nhập đã tồn tại',
    'users.required': 'Tên đăng nhập và mật khẩu là bắt buộc',
    'users.forbidden': 'Bị cấm. Yêu cầu quyền Admin.',
    'users.list': 'Danh sách người dùng',
    'users.no_users': 'Không tìm thấy người dùng',
    'users.loading': 'Đang tải danh sách người dùng...',
    'users.username_hint': 'Tên đăng nhập phải kết thúc bằng @slice.com',
    'users.delete': 'Xóa người dùng',
    'users.confirm_delete': 'Bạn có chắc chắn muốn xóa người dùng',

    // Login page
    'login.title': 'Chào mừng trở lại',
    'login.subtitle': 'Đăng nhập để truy cập tài khoản của bạn',
    'login.username': 'Tên đăng nhập',
    'login.password': 'Mật khẩu',
    'login.submit': 'Đăng nhập',
    'login.error': 'Tên đăng nhập hoặc mật khẩu không hợp lệ',
    'login.required': 'Trường này là bắt buộc',



    // Home page - Hero
    'home.badge': 'Chúng tôi đang xây dựng điều tuyệt vời',
    'home.title': 'Xây dựng ứng dụng',
    'home.titleHighlight': 'Có ý nghĩa',
    'home.description':
      'Chúng tôi là đội ngũ startup đam mê, tận tâm xây dựng các ứng dụng di động sáng tạo giải quyết vấn đề thực tế và tạo ra tác động thực sự trong cuộc sống của mọi người.',
    'home.meetTeam': 'Gặp đội ngũ',
    'home.readBlog': 'Đọc Blog',

    // Home page - Stats
    'home.stats.users': 'Người dùng',
    'home.stats.uptime': 'Hoạt động',
    'home.stats.support': 'Hỗ trợ',
    'home.stats.rating': 'Đánh giá',

    // Home page - Features
    'home.features.title': 'Tại sao chọn',
    'home.features.titleHighlight': 'Slice',
    'home.features.subtitle':
      'Chúng tôi kết hợp công nghệ tiên tiến với thiết kế chu đáo để tạo ra ứng dụng di động mà người dùng yêu thích.',
    'home.features.fast.title': 'Siêu nhanh',
    'home.features.fast.desc': 'Chúng tôi xây dựng ứng dụng được tối ưu hóa về tốc độ và hiệu suất ngay từ đầu.',
    'home.features.user.title': 'Tập trung người dùng',
    'home.features.user.desc': 'Mỗi tính năng chúng tôi xây dựng bắt đầu từ việc hiểu nhu cầu của người dùng.',
    'home.features.secure.title': 'An toàn & Đáng tin cậy',
    'home.features.secure.desc': 'Bảo mật không phải là ý nghĩ sau. Nó được tích hợp vào mọi thứ chúng tôi tạo ra.',
    'home.features.design.title': 'Thiết kế đẹp',
    'home.features.design.desc': 'Chúng tôi tin rằng sản phẩm tuyệt vời xứng đáng có thiết kế tuyệt vời. Mỗi pixel đều quan trọng.',

    // Home page - Hero cards
    'home.card.mobile': 'Ứng dụng di động',
    'home.card.platforms': 'iOS & Android',
    'home.card.growing': 'Phát triển nhanh',
    'home.card.growingDesc': 'Mở rộng cùng người dùng',

    // Home page - CTA
    'home.cta.title': 'Sẵn sàng xây dựng điều',
    'home.cta.titleHighlight': 'Tuyệt vời?',
    'home.cta.description':
      'Tham gia cùng hàng nghìn người dùng đang trải nghiệm tương lai của phát triển ứng dụng di động với Slice.',
    'home.cta.button': 'Bắt đầu ngay',
    'home.cta.learnMore': 'Tìm hiểu thêm',

    // About page
    'about.badge': 'Gặp đội ngũ',
    'about.title': 'Những người đứng sau',
    'about.titleHighlight': 'Slice',
    'about.subtitle': 'Chúng tôi là đội ngũ đa dạng gồm những người mơ mộng, xây dựng và giải quyết vấn đề, đoàn kết bởi niềm đam mê tạo ra công nghệ tạo nên sự khác biệt thực sự.',
    'about.values.title': 'Giá trị',
    'about.values.titleHighlight': 'của chúng tôi',
    'about.values.subtitle': 'Những nguyên tắc định hướng mọi thứ chúng tôi làm tại Slice.',
    'about.values.innovation.title': 'Đổi mới trước tiên',
    'about.values.innovation.desc': 'Chúng tôi vượt qua ranh giới và thách thức hiện trạng để tạo ra các giải pháp chưa từng được tưởng tượng.',
    'about.values.team.title': 'Đội nhóm trên cái tôi',
    'about.values.team.desc': 'Chúng tôi thành công cùng nhau. Mọi tiếng nói đều quan trọng, và ý tưởng tốt nhất sẽ chiến thắng bất kể từ đâu.',
    'about.values.user.title': 'Ám ảnh về người dùng',
    'about.values.user.desc': 'Người dùng là trung tâm của mọi thứ chúng tôi làm. Thành công của họ là thành công của chúng tôi.',
    'about.cta.title': 'Muốn tham gia',
    'about.cta.titleHighlight': 'đội ngũ',
    'about.cta.description': 'Chúng tôi luôn tìm kiếm những cá nhân tài năng chia sẻ niềm đam mê xây dựng sản phẩm tuyệt vời.',
    'about.cta.button': 'Xem vị trí tuyển dụng',

    'about.team.stripeEyebrow': 'Lãnh đạo & đội ngũ',
    'about.team.stripeTitle': 'Con người đứng sau sản phẩm',
    'about.team.stripeSub':
      'Kỹ thuật, thiết kế và phát triển — một đội ngũ hướng đến sản phẩm có ý nghĩa.',

    // About page - Team members
    'about.team.hieu.bio': 'Chuyên gia full-stack yêu thích các giải pháp tinh tế. Tin rằng code phải đọc như thơ và xây dựng sản phẩm có ý nghĩa.',
    'about.team.nhi.bio': 'Nhà tiếp thị chiến lược với niềm đam mê kể chuyện thương hiệu. Biến đổi thông tin chi tiết thành các chiến dịch có tác động và cộng hưởng.',
    'about.team.hung.bio': 'Lãnh đạo tiếp thị có tầm nhìn thúc đẩy tăng trưởng và nhận thức thương hiệu. Chuyên gia về chiến lược kỹ thuật số và lãnh đạo nhóm.',
    'about.team.son.bio': 'Nhà thiết kế sáng tạo tạo ra trải nghiệm hoàn hảo từng pixel. Thiết kế không chỉ là cách nó trông như thế nào, mà còn là cách nó hoạt động.',
    'about.team.phu.bio': 'Người kể chuyện trực quan biến ý tưởng thành hiện thực. Đam mê tạo ra giao diện người dùng đẹp và trực quan.',

    // Blog page
    'blog.badge': 'Blog của chúng tôi',
    'blog.title': 'Thông tin &',
    'blog.titleHighlight': 'Câu chuyện',
    'blog.subtitle': 'Suy nghĩ, bài học và thông tin chi tiết từ đội ngũ của chúng tôi về việc xây dựng sản phẩm tuyệt vời.',
    'blog.readMore': 'Đọc thêm',
    'blog.loadMore': 'Tải thêm bài viết',
    'blog.newsletter.title': 'Đăng ký nhận bản tin',
    'blog.newsletter.desc': 'Nhận thông tin chi tiết và cập nhật mới nhất gửi thẳng đến hộp thư của bạn.',
    'blog.newsletter.placeholder': 'Nhập email của bạn',
    'blog.newsletter.button': 'Đăng ký',
    'blog.category.all': 'Tất cả',
    'blog.category.technology': 'Công nghệ',
    'blog.category.engineering': 'Kỹ thuật',
    'blog.category.design': 'Thiết kế',
    'blog.category.product': 'Sản phẩm',
    'blog.category.process': 'Quy trình',

    // FAQ page
    'faq.badge': 'Trung tâm hỗ trợ',
    'faq.title': 'Câu hỏi',
    'faq.titleHighlight': 'thường gặp',
    'faq.subtitle': 'Tìm câu trả lời cho các câu hỏi phổ biến về Slice và sản phẩm của chúng tôi.',
    'faq.items.what.question': 'Slice là gì và các bạn làm gì?',
    'faq.items.what.answer':
      'Slice là startup tập trung xây dựng ứng dụng di động native cho iOS và Android để giải quyết vấn đề thực tế. Chúng tôi kết hợp thiết kế tinh tế với kỹ thuật vững để tạo ra sản phẩm được người dùng yêu thích.',
    'faq.items.started.question': 'Làm thế nào để bắt đầu với sản phẩm của bạn?',
    'faq.items.started.answer':
      'Bắt đầu rất dễ! Tải ứng dụng di động, đăng ký tài khoản và bạn sẽ có quyền truy cập các tính năng. Chúng tôi có gói miễn phí để bạn trải nghiệm trước khi nâng cấp.',
    'faq.items.custom.question': 'Bạn có cung cấp dịch vụ phát triển theo yêu cầu không?',
    'faq.items.custom.answer':
      'Có! Chúng tôi làm việc với doanh nghiệp ở mọi quy mô để xây dựng ứng dụng di động tùy chỉnh theo nhu cầu. Hãy liên hệ để trao đổi dự án và nhận báo giá phù hợp.',
    'faq.items.security.question': 'Bạn đảm bảo bảo mật ứng dụng như thế nào?',
    'faq.items.security.answer':
      'Bảo mật được tích hợp trong mọi lớp của quy trình phát triển. Chúng tôi tuân thủ best practices, kiểm tra bảo mật định kỳ và mã hóa dữ liệu nhạy cảm. Bảo mật của bạn là ưu tiên hàng đầu.',
    'faq.items.support.question': 'Bạn cung cấp hỗ trợ như thế nào?',
    'faq.items.support.answer':
      'Chúng tôi cung cấp hỗ trợ 24/7 qua nhiều kênh như email, chat và điện thoại. Đội hỗ trợ luôn sẵn sàng giúp bạn với mọi câu hỏi hoặc vấn đề.',
    'faq.items.feature.question': 'Tôi có thể đề xuất tính năng mới không?',
    'faq.items.feature.answer':
      'Hoàn toàn có thể! Chúng tôi luôn lắng nghe người dùng. Bạn có thể gửi đề xuất qua cổng phản hồi và đội sản phẩm sẽ xem xét từng gợi ý để ưu tiên roadmap.',
    'faq.items.mobile.question': 'Slice có bản web hoặc desktop không?',
    'faq.items.mobile.answer':
      'Chúng tôi tập trung ứng dụng di động native cho iOS và Android. Hiện không có bản web hay desktop.',
    'faq.cta.title': 'Vẫn còn câu hỏi?',
    'faq.cta.description': 'Không tìm thấy điều bạn cần? Đội hỗ trợ của chúng tôi sẵn sàng giúp đỡ.',
    'faq.cta.email': 'Hỗ trợ qua Email',
    'faq.cta.chat': 'Chat trực tiếp',

    // Privacy Policy page
    'privacy.badge': 'Pháp lý',
    'privacy.title': 'Chính sách bảo mật',
    'privacy.lastUpdated': 'Cập nhật lần cuối: 22 tháng 4, 2026',
    'privacy.intro': 'Telify ("chúng tôi") cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách thông tin cá nhân của bạn được thu thập, sử dụng và tiết lộ bởi Telify. Chính sách bảo mật này áp dụng cho ứng dụng di động ("Telify") và các dịch vụ liên quan của chúng tôi.',
    'privacy.sections.information.title': 'Thông tin chúng tôi thu thập',
    'privacy.sections.information.content': 'Chúng tôi thu thập thông tin bạn cung cấp trực tiếp cho chúng tôi, bao gồm: tên, địa chỉ email, số điện thoại và bất kỳ thông tin nào khác bạn chọn cung cấp. Chúng tôi cũng có thể thu thập thông tin thiết bị như loại thiết bị, hệ điều hành và mã định danh thiết bị duy nhất.',
    'privacy.sections.usage.title': 'Cách chúng tôi sử dụng thông tin của bạn',
    'privacy.sections.usage.content': 'Chúng tôi sử dụng thông tin chúng tôi thu thập để cung cấp, duy trì và cải thiện dịch vụ của mình, giao tiếp với bạn về sản phẩm của chúng tôi và bảo vệ người dùng cũng như dịch vụ của chúng tôi.',
    'privacy.sections.security.title': 'Bảo mật dữ liệu',
    'privacy.sections.security.content': 'Chúng tôi thực hiện các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ tính bảo mật của thông tin cá nhân của bạn. Tuy nhiên, không có phương pháp truyền tải nào qua Internet là 100% an toàn.',
    'privacy.sections.contact.title': 'Liên hệ với chúng tôi',
    'privacy.sections.contact.content': 'Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua: hieubh130700@gmail.com',
    'privacy.questions': 'Có câu hỏi nào về thực tiễn bảo mật của chúng tôi?',

    // Terms of Service page
    'terms.badge': 'Pháp lý',
    'terms.title': 'Điều khoản dịch vụ',
    'terms.lastUpdated': 'Cập nhật lần cuối: 22 tháng 4, 2026',
    'terms.intro': 'Chào mừng bạn đến với Telify – một ứng dụng di động được thiết kế nhằm giúp người dùng tạo lời nhắc, quản lý lịch trình cá nhân và duy trì sự kết nối ý nghĩa với những người quan trọng trong cuộc sống. Khi truy cập hoặc sử dụng Telify, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ các Điều khoản dịch vụ này.',
    'terms.questions': 'Có câu hỏi nào về điều khoản của chúng tôi?',
    'terms.sections.about.title': 'Giới thiệu về Telify',
    'terms.sections.about.content': 'Telify là một nền tảng số giúp người dùng tạo, tổ chức và trực quan hóa lịch trình một cách đơn giản và trực quan. Ứng dụng cho phép bạn tạo lời nhắc, sắp xếp sự kiện theo dòng thời gian và chia sẻ các sự kiện với người khác. Telify tích hợp trí tuệ nhân tạo để hỗ trợ người dùng tạo lịch trình thông qua ngôn ngữ tự nhiên.',
    'terms.sections.eligibility.title': 'Điều kiện sử dụng',
    'terms.sections.eligibility.content': 'Telify chỉ dành cho người dùng từ 13 tuổi trở lên. Khi sử dụng ứng dụng, bạn xác nhận rằng bạn đáp ứng yêu cầu độ tuổi này. Nếu bạn chưa đủ tuổi trưởng thành theo quy định pháp luật tại nơi bạn sinh sống, bạn cần có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp.',
    'terms.sections.accounts.title': 'Tài khoản và truy cập',
    'terms.sections.accounts.content': 'Telify cho phép người dùng linh hoạt trong việc truy cập, bao gồm đăng nhập qua Apple hoặc Google, hoặc sử dụng dưới dạng khách mà không cần tạo tài khoản. Bạn chịu trách nhiệm bảo mật thiết bị và thông tin truy cập của mình. Mọi hoạt động thông qua thiết bị hoặc tài khoản của bạn đều được xem là do bạn thực hiện.',
    'terms.sections.use.title': 'Quy định sử dụng dịch vụ',
    'terms.sections.use.content': 'Khi sử dụng Telify, bạn đồng ý chỉ sử dụng ứng dụng cho các mục đích hợp pháp và phù hợp. Mọi hành vi như gửi lời nhắc spam, quấy rối người dùng khác hoặc chia sẻ nội dung độc hại đều bị nghiêm cấm. Bạn không được phép sao chép, chỉnh sửa hoặc khai thác hệ thống của ứng dụng.',
    'terms.sections.content.title': 'Nội dung chia sẻ',
    'terms.sections.content.content': 'Telify cho phép bạn chia sẻ lịch trình và sự kiện với người khác. Các nội dung được chia sẻ chỉ mang tính xem, người nhận không thể chỉnh sửa. Bạn hoàn toàn chịu trách nhiệm về nội dung mà bạn chia sẻ, và Telify có quyền xóa bỏ các nội dung vi phạm điều khoản.',
    'terms.sections.ai.title': 'Telify AI',
    'terms.sections.ai.content': 'Telify tích hợp trí tuệ nhân tạo nhằm hỗ trợ người dùng tạo lịch trình nhanh chóng. Mặc dù AI được thiết kế để đưa ra gợi ý hữu ích, kết quả do AI tạo ra không phải lúc nào cũng chính xác hoặc đầy đủ. Bạn cần sử dụng sự đánh giá cá nhân khi áp dụng các nội dung này, và Telify không chịu trách nhiệm đối với hệ quả phát sinh.',
    'terms.sections.subscription.title': 'Gói dịch vụ và thanh toán',
    'terms.sections.subscription.content': 'Telify cung cấp gói dịch vụ trả phí mang tên Telify Premium. Người dùng có thể được cung cấp thời gian dùng thử miễn phí trước khi bắt đầu tính phí. Sau khi kết thúc thời gian dùng thử, gói dịch vụ sẽ tự động gia hạn trừ khi bạn chủ động hủy. Thanh toán được thực hiện qua Apple hoặc Google.',
    'terms.sections.data.title': 'Dữ liệu và quyền riêng tư',
    'terms.sections.data.content': 'Telify thu thập và xử lý một số loại dữ liệu người dùng, bao gồm thông tin cá nhân, thông tin thiết bị và phân tích sử dụng. Thông tin này được sử dụng để nâng cao hiệu suất ứng dụng, phân tích hành vi người dùng và hỗ trợ các tính năng AI. Telify không hiển thị quảng cáo từ bên thứ ba trong ứng dụng.',
    'terms.sections.thirdParty.title': 'Dịch vụ bên thứ ba',
    'terms.sections.thirdParty.content': 'Telify sử dụng một số dịch vụ bên thứ ba, bao gồm Google Firebase, để phục vụ lưu trữ dữ liệu, phân tích hành vi người dùng và giám sát hiệu suất hệ thống. Các dịch vụ này có thể xử lý dữ liệu của bạn theo chính sách riêng của họ. Telify không kiểm soát và không chịu trách nhiệm đối với hoạt động của các bên thứ ba này.',
    'terms.sections.availability.title': 'Tính sẵn sàng của dịch vụ',
    'terms.sections.availability.content': 'Telify được cung cấp trên cơ sở "nguyên trạng" và "sẵn có". Có thể xảy ra tình trạng chậm trễ thông báo, lỗi hệ thống hoặc gián đoạn dịch vụ. Người dùng hiểu rằng Telify chỉ đóng vai trò là công cụ hỗ trợ, không phải là hệ thống đảm bảo tuyệt đối.',
    'terms.sections.device.title': 'Thiết bị và kết nối',
    'terms.sections.device.content': 'Một số tính năng của Telify yêu cầu kết nối internet để hoạt động đầy đủ. Bạn chịu trách nhiệm đảm bảo thiết bị của mình tương thích và có kết nối ổn định. Mọi chi phí phát sinh từ việc sử dụng dữ liệu mạng đều do bạn chi trả.',
    'terms.sections.liability.title': 'Giới hạn trách nhiệm',
    'terms.sections.liability.content': 'Trong phạm vi pháp luật cho phép, Telify không chịu trách nhiệm đối với bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng ứng dụng. Điều này bao gồm bỏ lỡ sự kiện, mất dữ liệu hoặc các quyết định dựa trên nội dung do AI cung cấp. Người dùng hiểu rằng Telify chỉ là công cụ hỗ trợ.',
    'terms.sections.changes.title': 'Thay đổi điều khoản',
    'terms.sections.changes.content': 'Telify có quyền cập nhật hoặc điều chỉnh các Điều khoản dịch vụ này bất kỳ lúc nào để phản ánh sự thay đổi của dịch vụ hoặc yêu cầu pháp lý. Các thay đổi sẽ được thông báo trong ứng dụng. Việc bạn tiếp tục sử dụng Telify sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản đã được cập nhật.',
    'terms.sections.termination.title': 'Chấm dứt sử dụng',
    'terms.sections.termination.content': 'Telify có quyền tạm ngưng hoặc chấm dứt quyền truy cập của bạn nếu phát hiện hành vi vi phạm các điều khoản hoặc gây ảnh hưởng đến hệ thống và cộng đồng người dùng. Bạn cũng có thể ngừng sử dụng ứng dụng bất kỳ lúc nào. Việc chấm dứt không ảnh hưởng đến các quyền và nghĩa vụ đã phát sinh trước đó.',
    'terms.sections.contact.title': 'Liên hệ',
    'terms.sections.contact.content': 'Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào liên quan đến Điều khoản dịch vụ, bạn có thể liên hệ với Telify qua email hieubh130700@gmail.com hoặc các kênh hỗ trợ chính thức trong ứng dụng.',

    // Footer
    'footer.description': 'Chúng tôi là đội ngũ startup đam mê xây dựng các ứng dụng sáng tạo tạo nên sự khác biệt. Hãy tham gia cùng chúng tôi trong hành trình tạo ra điều tuyệt vời.',
    'footer.navigation': 'Điều hướng',
    'footer.contact': 'Liên hệ',
    'footer.copyright': '© {year} Slice. Bảo lưu mọi quyền.',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.terms': 'Điều khoản dịch vụ',

    // Language switcher
    'lang.switch': 'Ngôn ngữ',
  },
} as const;

export type TranslationKey = keyof typeof ui.en;
