# Art Depart

![Status](https://img.shields.io/badge/Status-Proof_of_Concept-blue)
![Version](https://img.shields.io/badge/Version-1.0-blue)
![Platform](https://img.shields.io/badge/Platform-Windows-lightgrey)

**Steal the spotlight, masterpiece by masterpiece.**

Art Depart is an educational stealth game that transports players to the gilded halls of Renaissance Italy. Step into the shadowy shoes of an ingenious art thief who must navigate labyrinthine museums, outwit patrolling guards, and solve intricate puzzles to claim history's most prized masterpieces.

## Features

- **Art Education Meets Fun**: Learn about famous painting techniques like Impasto, Sfumato, and Pointillism, all woven seamlessly into gameplay
- **Stealth Gameplay**: Navigate past a patrolling guard to reach masterpieces and escape through locked doors
- **Interactive Quizzes**: Test your knowledge with engaging visual quizzes featuring flipping card mechanics
- **Three Unique Levels**: Each with distinct Renaissance-inspired environments and challenges

## Gameplay

Art Depart combines stealth mechanics with educational content in a rewarding gameplay loop:

1. **Navigate** past enemy guards using strategic movement
2. **Study** famous paintings and learn about their techniques
3. **Answer** quiz questions at the door to progress
4. **Advance** to the next level and discover new masterpieces

## Controls

- **W/A/S/D**: Move your character in four directions (RPG-style directional movement)
- **Mouse**: Interact with paintings, doors, and navigate menus
- Movement snaps to cardinal directions for precise navigation

## Technical Stack

Art Depart is built using modern web technologies:

- **Three.js**: 3D rendering and scene management
- **Vite**: Fast development build tool
- **Yarn**: Package management
- **NW.js**: Desktop application compilation
- **Blender**: 3D asset creation and modeling

## Educational Content

Learn about three major painting techniques:

- **Impasto**: Thick paint application where brush or painting-knife strokes are visible
- **Sfumato**: Hazy quality that creates subtle transitions without harsh outlines
- **Pointillism**: Applying dots of color that blend together when viewed from a distance

## Game Design Philosophy

**Learning Through Play**: We designed Art Depart to make education engaging by treating knowledge as a reward. Players first experience the thrill of stealth gameplay, then access educational content as they progress—similar to unlocking new levels in a game.

**Visual Feedback**: Fun visual elements like card-flipping animations make testing enjoyable rather than tedious.

**Accessibility**: Simple, clean UI design ensures the focus stays on gameplay and learning.

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Building

To compile the game into a standalone executable:
```bash
npm run build
```

## Characters

- **Player**: A clever art thief on a mission to preserve masterpieces
- **Guard**: Patrolling museum security

Both characters share similar models and rigs for efficient development, allowing them to use the same animation sets.

## Levels

**Level 1**: Renaissance Gallery  

**Level 2**: Dark Corridor  

**Level 3**: Twilight Chamber  

## Development Challenges

Working with JavaScript and Three.js presented unique challenges compared to traditional game engines:

- Manual lighting system implementation
- Custom collision detection with invisible boundary walls
- Texture rendering issues requiring creative solutions
- Building interactive UI without traditional game engine tools

---
