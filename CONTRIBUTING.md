# Contributing to MyMe

Thank you for your interest in contributing to MyMe! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/MyMe.git
   cd MyMe
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start development servers**
   ```bash
   # Terminal 1
   node whatsapp-service.js
   
   # Terminal 2
   npm run dev
   ```

## 📋 Development Guidelines

### **Code Style**
- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

### **Testing**
- Test all changes locally
- Ensure both frontend and backend work together
- Test WhatsApp integration if applicable

### **Documentation**
- Update relevant documentation in `docs/` folder
- Follow the project's documentation requirements:
  - Update `docs/CURRENT_WORK_LOG.md` for new features
  - Update `docs/ERROR_TRACKING.md` for bug fixes
  - Update `docs/MASTER_REFERENCE.md` for significant changes

## 🐛 Bug Reports

When reporting bugs, please include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node.js version, browser
- **Screenshots**: If applicable

## ✨ Feature Requests

For new features:
- **Description**: Clear description of the feature
- **Use Case**: Why this feature would be useful
- **Implementation Ideas**: Any thoughts on implementation
- **Mockups**: Visual mockups if applicable

## 🔧 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add tests if applicable
   - Update documentation

3. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use a clear title and description
   - Reference any related issues
   - Include screenshots if applicable

### **Commit Message Format**
```
type: description

Types:
- feat: new feature
- fix: bug fix
- docs: documentation changes
- style: formatting changes
- refactor: code refactoring
- test: adding tests
- chore: maintenance tasks
```

## 📁 Project Structure

```
MyMe/
├── src/
│   ├── components/          # React components
│   ├── types/              # TypeScript definitions
│   ├── app/                # Next.js app directory
│   └── lib/                # Utility functions
├── docs/                   # Documentation
├── whatsapp-service.js     # WhatsApp backend service
└── README.md              # Main documentation
```

## 🎯 Areas for Contribution

### **High Priority**
- Mobile app conversion (Capacitor.js)
- UI/UX improvements
- Performance optimizations
- Error handling improvements

### **Medium Priority**
- Additional WhatsApp features
- Better contact management
- Message search functionality
- Theme customization

### **Low Priority**
- Code refactoring
- Documentation improvements
- Testing enhancements

## 🔒 Security

- Never commit sensitive information (API keys, tokens)
- Use environment variables for configuration
- Follow security best practices
- Report security issues privately

## 📞 Getting Help

- Check existing [documentation](docs/)
- Review [error tracking](docs/ERROR_TRACKING.md)
- Open an issue for questions
- Join discussions in issues and PRs

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to MyMe! 🎉**