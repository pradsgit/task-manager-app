# Task Manager with AI Motivation

A task management application with AI-powered motivational tips using Firebase and OpenAI.

## Live Demo
[Your Firebase Hosting URL Here]

## Features

- Create and complete tasks
- AI-powered task motivation (GPT-4o-mini)
- Real-time sync with Firestore
- Clean, responsive UI

## Approach

### Technology Choices
- **React + Vite**: Fast development with instant HMR
- **Firestore**: Chose NoSQL for real-time sync capabilities and simple data structure (tasks don't need complex relations)
- **OpenAI GPT-4o-mini**: Cost-effective AI model that balances quality and price for motivational tips
- **Tailwind CSS**: Rapid UI development with utility-first approach

### Implementation Strategy

**Real-time Synchronization**: Implemented Firestore's `onSnapshot` listeners to automatically update the UI when tasks change, eliminating need for manual refresh or polling. This creates instant feedback across all user sessions.

**AI Integration**: Connected OpenAI API to provide contextual task motivation. Limited AI calls to user-initiated actions (button clicks) to control costs. Designed prompts to generate concise, actionable tips rather than generic motivation.

**State Management**: Used React's built-in hooks (useState, useEffect) instead of external libraries

**Error Handling**: Implemented comprehensive try-catch blocks for both Firestore operations and API calls, displaying user-friendly error messages instead of silent failures.

### Challenges & Solutions

- **API cost management**: Made AI motivation optional/on-demand rather than automatic for every task
- **Firebase security**: Set up Firestore rules to allow authenticated access while preventing abuse
