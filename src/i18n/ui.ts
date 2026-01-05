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

    // Home page - Hero
    'home.badge': "We're building something amazing",
    'home.title': 'Building Apps',
    'home.titleHighlight': 'That Matter',
    'home.description': "We're a passionate startup team dedicated to creating innovative applications that solve real problems and make a genuine impact in people's lives.",
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
    'home.features.subtitle': 'We combine cutting-edge technology with thoughtful design to create apps that users love.',
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
    'home.card.web': 'Web Apps',
    'home.card.growing': 'Growing Fast',
    'home.card.growingDesc': 'Scaling with our users',

    // Home page - CTA
    'home.cta.title': 'Ready to Build Something',
    'home.cta.titleHighlight': 'Amazing',
    'home.cta.description': 'Join thousands of users who are already experiencing the future of app development with Slice.',
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
    'faq.cta.title': 'Still Have Questions?',
    'faq.cta.description': "Can't find what you're looking for? Our support team is here to help.",
    'faq.cta.email': 'Email Support',
    'faq.cta.chat': 'Live Chat',

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

    // Home page - Hero
    'home.badge': 'Chúng tôi đang xây dựng điều tuyệt vời',
    'home.title': 'Xây dựng ứng dụng',
    'home.titleHighlight': 'Có ý nghĩa',
    'home.description': 'Chúng tôi là đội ngũ startup đam mê, tận tâm tạo ra các ứng dụng sáng tạo giải quyết vấn đề thực tế và tạo ra tác động thực sự trong cuộc sống của mọi người.',
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
    'home.features.subtitle': 'Chúng tôi kết hợp công nghệ tiên tiến với thiết kế chu đáo để tạo ra ứng dụng mà người dùng yêu thích.',
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
    'home.card.web': 'Ứng dụng web',
    'home.card.growing': 'Phát triển nhanh',
    'home.card.growingDesc': 'Mở rộng cùng người dùng',

    // Home page - CTA
    'home.cta.title': 'Sẵn sàng xây dựng điều',
    'home.cta.titleHighlight': 'Tuyệt vời',
    'home.cta.description': 'Tham gia cùng hàng nghìn người dùng đang trải nghiệm tương lai của phát triển ứng dụng với Slice.',
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
    'faq.cta.title': 'Vẫn còn câu hỏi?',
    'faq.cta.description': 'Không tìm thấy điều bạn cần? Đội hỗ trợ của chúng tôi sẵn sàng giúp đỡ.',
    'faq.cta.email': 'Hỗ trợ qua Email',
    'faq.cta.chat': 'Chat trực tiếp',

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

