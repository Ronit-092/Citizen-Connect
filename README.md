# CitizenConnect - Civic Engagement Platform 🏛️

> **Your Voice, Their Action** - Bridge the gap between citizens and government through transparent civic engagement.

## 🌟 Features

### For Citizens
- **Easy Complaint Filing** - Submit civic issues with photos and precise locations
- **Real-time Tracking** - Monitor your complaint's progress from submission to resolution
- **Interactive Maps** - Pin-point exact locations using Leaflet maps
- **Dashboard Overview** - View all your complaints and their statuses
- **Transparent Process** - Full visibility into government actions

### For Government Officials
- **Centralized Management** - Handle all citizen complaints from one dashboard
- **Status Updates** - Mark complaints as pending, in-progress, or resolved
- **Location Visualization** - See complaint locations on interactive maps
- **Analytics & Reporting** - Track resolution rates and department performance
- **Citizen Communication** - Add remarks and updates for citizens

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/Ronit-092/Test2.0.git
   cd Test2.0
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   
3. **Open in Browser**
   - Navigate to `http://localhost:8080`
   - The app will automatically reload on file changes

### Production Build
```bash
npm run build
npm start
```

## 🎯 User Flows

### Citizen Journey
1. **Homepage** → Click "Get Started" or "Login"
2. **Signup/Login** → Create account or sign in
3. **Dashboard** → View existing complaints or file new ones
4. **File Complaint** → Fill form, select location on map, add photos
5. **Track Progress** → Monitor status updates from government

### Government Journey
1. **Homepage** → Click "Government Login" 
2. **Login** → Access with department credentials
3. **Dashboard** → View complaints by status and category
4. **Manage Complaints** → Update status, add remarks, view locations
5. **Analytics** → Track resolution rates and performance

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#7c3aed) - Government authority and trust
- **Secondary**: Teal (#14b8a6) - Progress and action
- **Background**: Deep purple gradient - Professional and modern
- **Text**: White/Gray hierarchy for accessibility

### Typography
- **Font Family**: Inter - Clean, readable, professional
- **Sizes**: Responsive scale from mobile to desktop
- **Weights**: 400 (regular), 600 (semibold), 700 (bold), 800 (extra bold)

## 🛠️ Technical Stack

### Frontend
- **React 18** - Component library
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **React Router 6** - Client-side routing
- **Vite** - Build tool and dev server

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful, customizable icons
- **Leaflet** - Interactive maps
- **Framer Motion** - Smooth animations

### Backend Integration Ready
- **Express** - Server framework (included)
- **API Routes** - RESTful endpoint structure
- **Type Safety** - Shared types between client/server

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 375px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Mobile-First Features
- Touch-friendly buttons (min 44px)
- Simplified navigation
- Optimized map interactions
- Responsive form layouts

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: Full keyboard access
- **Screen Readers**: ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators

### Features
- Keyboard shortcuts for common actions
- Alt text for all images
- Form labels and error messages
- Skip navigation links

## 🔧 Project Structure

```
├── client/                 # React frontend
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Radix UI components
│   │   ├── CategorySelect.tsx
│   │   ├── ComplaintModal.tsx
│   │   ├── LeafletMap.tsx
│   │   └── LoginModal.tsx
│   ├── pages/             # Route components
│   │   ├── Index.tsx      # Homepage
│   │   ├── CitizenLogin.tsx
│   │   ├── CitizenSignup.tsx
│   │   ├── CitizenDashboard.tsx
│   │   ├── GovtLogin.tsx
│   │   ├── GovtDashboard.tsx
│   │   └── NotFound.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/              # Utilities and helpers
│   └── global.css        # Global styles and animations
├── server/               # Express backend (optional)
├── shared/              # Shared types and interfaces
└── public/              # Static assets
```

## 🧪 Testing Checklist

### Navigation & Routing ✅
- [ ] Homepage navigation buttons work
- [ ] Login/signup redirects function
- [ ] Dashboard access control
- [ ] 404 page handling

### Form Validation ✅
- [ ] Required field validation
- [ ] Email format validation
- [ ] Password strength requirements
- [ ] Error message display

### Complaint System ✅
- [ ] Modal opening/closing
- [ ] Form submission
- [ ] Map location selection
- [ ] Category selection
- [ ] Status updates

### Responsive Design ✅
- [ ] Mobile layout (375px+)
- [ ] Tablet layout (768px+)
- [ ] Desktop layout (1024px+)
- [ ] Touch interactions

### Accessibility ✅
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast ratios
- [ ] Focus indicators

## 🚀 Deployment

### Netlify (Recommended)
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Vercel
```bash
npm run build  
# Deploy using Vercel CLI or GitHub integration
```

### Manual Server
```bash
npm run build
npm start
# Runs on configured port
```

## 🛡️ Security Considerations

### Frontend Security
- Input sanitization
- XSS prevention
- CSRF protection ready
- Environment variable management

### Backend Integration
- Authentication middleware ready
- Rate limiting structure
- CORS configuration
- Input validation schemas

## 🔄 Future Enhancements

### Planned Features
- [ ] **Real-time Notifications** - Push updates to citizens
- [ ] **Advanced Analytics** - Department performance dashboards
- [ ] **Multi-language Support** - Localization framework
- [ ] **Mobile App** - React Native version
- [ ] **AI Integration** - Automated complaint categorization
- [ ] **API Documentation** - Swagger/OpenAPI specs

### Technical Improvements
- [ ] **Offline Support** - Progressive Web App features
- [ ] **Performance** - Code splitting and lazy loading
- [ ] **Testing** - Unit and E2E test suites
- [ ] **Monitoring** - Error tracking and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Write accessible, semantic HTML
- Test on multiple devices/browsers
- Update documentation for new features

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Contact**: Open discussions for general questions

---

**Built with ❤️ for transparent governance and civic engagement**

*Empowering citizens to report issues and ensuring government accountability through complete transparency.*