# Modern Reading List Application

A modernized React application for managing your personal reading list, built with 2025 web standards and best practices.

## ✨ Features

### 🎨 Modern Design System

- **Dark/Light Mode**: Automatic system preference detection with manual toggle
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop
- **Modern Typography**: Inter font family with proper hierarchy
- **Color System**: Consistent color palette with CSS custom properties
- **Component Library**: Reusable UI components with proper accessibility

### 🚀 Performance & Accessibility

- **Code Splitting**: Lazy loading for optimal performance
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Focus trapping in modals and proper focus indicators
- **WCAG Compliance**: Meets accessibility standards

### 🎭 Animations & Interactions

- **Smooth Transitions**: Framer Motion powered animations
- **Micro-interactions**: Hover effects and loading states
- **Staggered Animations**: Beautiful list animations
- **Loading States**: Skeleton screens and spinners

### 📚 Book Management

- **CRUD Operations**: Add, view, and delete books
- **Status Tracking**: To Read, Reading, Completed
- **Search & Filter**: Real-time search and status filtering
- **Sorting**: Sort by title, author, or status
- **Confirmation Dialogs**: Safe delete operations

## 🛠️ Technology Stack

- **React 18** - Latest React with concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Headless UI** - Unstyled, accessible UI components
- **Lucide React** - Beautiful icon library
- **React Toastify** - Toast notifications
- **Vitest** - Fast unit testing framework

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd reading-list-front-end-with-managed-auth
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🏗️ Project Structure

```
src/
├── api/                    # API layer
│   └── books/             # Book-related API calls
├── components/            # React components
│   ├── book/             # Book-specific components
│   ├── layout/           # Layout components
│   ├── modal/            # Modal components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and hooks
│   ├── hooks/           # Custom React hooks
│   ├── theme-context.tsx # Theme management
│   └── utils.ts         # Utility functions
└── test/                # Test setup and utilities
```

## 🎨 Design System

### Colors

The application uses a semantic color system with CSS custom properties:

- `--primary` - Primary brand color
- `--secondary` - Secondary color
- `--destructive` - Error/danger color
- `--muted` - Muted text color
- `--accent` - Accent color

### Typography

- **Font Family**: Inter (primary), JetBrains Mono (monospace)
- **Scale**: Consistent type scale from xs to 6xl
- **Weights**: 100-900 variable font weights

### Components

All components follow consistent patterns:

- Proper TypeScript interfaces
- Accessibility attributes
- Responsive design
- Theme support
- Animation support

## 🧪 Testing

The application includes comprehensive tests:

- **Unit Tests**: Component and utility function tests
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Integration Tests**: User interaction flows

Run tests with:

```bash
npm run test
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Management**: Visible focus indicators and focus trapping
- **Color Contrast**: WCAG AA compliant color ratios
- **Semantic HTML**: Proper heading hierarchy and landmarks

## 🔧 Configuration

### Environment Variables

Create a `public/config.js` file for API configuration:

```javascript
window.configs = {
  apiUrl: "your-api-endpoint",
};
```

### Theme Customization

Modify `tailwind.config.cjs` to customize the design system:

- Colors
- Typography
- Spacing
- Animations

## 🚀 Deployment

The application builds to static files and can be deployed to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
