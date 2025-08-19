# Contributing to Pomodoro Timer App

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to sync code, track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

1. **Clone your fork of the repo:**
   ```bash
   git clone https://github.com/yourusername/pomodoro-timer-app.git
   cd pomodoro-timer-app
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements-dev.txt
   ```

4. **Run the development server:**
   ```bash
   python app.py
   ```

5. **Make your changes and test thoroughly**

## Code Style

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Comment your code where necessary
- Keep functions small and focused
- Use consistent indentation (4 spaces for Python, 2 spaces for HTML/CSS/JS)

## JavaScript Guidelines

- Use ES6+ features where appropriate
- Follow consistent naming conventions (camelCase)
- Add JSDoc comments for complex functions
- Ensure browser compatibility (Chrome 88+, Firefox 85+, Safari 14+)

## CSS Guidelines

- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Use meaningful class names
- Organize CSS logically (base, components, utilities)

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](../../issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please provide:

- **Clear description** of the feature
- **Use case** - why would this feature be useful?
- **Examples** of how it would work
- **Implementation ideas** (optional)

## Areas for Contribution

### High Priority
- PWA implementation (service worker, offline support)
- Session history and statistics
- Additional notification sounds
- Accessibility improvements
- Performance optimizations

### Medium Priority
- Additional themes and customization options
- Keyboard navigation enhancements
- Export functionality for session data
- Integration with productivity tools

### Low Priority
- Team collaboration features
- Advanced Pomodoro technique variations
- Social features
- Mobile app version

## Testing

- Test your changes across different browsers
- Verify responsive design on various screen sizes
- Test fullscreen mode functionality
- Verify audio features work correctly
- Check localStorage persistence

## Questions?

Don't hesitate to ask questions by opening an issue or starting a discussion!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
