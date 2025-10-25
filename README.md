This project was created using Qoder editor with review from Gemini
2.5 PRO under Konstantin Ladutenko supervision.

---

# Hexagonal Architecture Login Demo

This is a minimalistic teaching project demonstrating a login form with password and OAuth options using vanilla TypeScript. The primary goal is to provide a clear, practical example of Hexagonal Architecture (also known as the Ports and Adapters pattern).

## How to Run

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```    Navigate to `http://localhost:5173`. Use `admin` / `password` for the password login.

3.  **Run tests:**
    ```bash
    npm test
    ```

## Technology Stack

-   **TypeScript**: For type-safe JavaScript.
-   **Vite**: For a fast development and build environment.
-   **Vitest**: For unit testing the core logic.
-   **No Frameworks**: The core application logic is intentionally framework-agnostic.

## Architecture: The Hexagonal Approach

This project is structured to isolate the core application logic from external concerns like the UI, database, or third-party services. This is achieved by creating a "hexagon" where the inside (the application) is completely independent of the outside (infrastructure).

```
src/
├── domain/        # The Core: Business rules & interfaces (Ports)
├── app/           # Application Layer: Orchestrates use cases
└── adapters/      # Infrastructure: Implements ports (Adapters)

App.ts             # Public API / Façade for the application
index.html         # The UI Layer (another type of adapter)
```

### The Core Layers Explained

1.  **Domain Layer (`src/domain`)**
    *   **Purpose**: The heart of the application. Contains pure, technology-agnostic business logic.
    *   **Contents**:
        *   **Entities** (`User.ts`): The core business objects.
        *   **Ports** (`AuthPort.ts`, `StoragePort.ts`): The crucial interfaces that define the contracts for what the application *needs* from the outside world (e.g., "I need a way to authenticate a user"). It does not care *how* this is done.

2.  **Application Layer (`src/app`)**
    *   **Purpose**: To orchestrate the flow of data and execute business rules. It represents the "use cases" of the application.
    *   **Contents**:
        *   `AuthUsecase.ts`: Implements the login/logout functionality. It depends only on the **Ports** from the Domain Layer, not on any specific implementation.

3.  **Infrastructure Layer (`src/adapters`)**
    *   **Purpose**: The implementation details. This is where the application connects to the real world.
    *   **Contents**:
        *   **Adapters**: Concrete classes that implement the **Ports**.
            *   `PwdAdapter.ts`: Implements `AuthPort` for password authentication.
            *   `OAuthAdapter.ts`: Implements `AuthPort` for OAuth.
            *   `LocalStorageAdapter.ts`: Implements `StoragePort` using the browser's `localStorage`.

### The UI Layer: A User-Facing Adapter

In Hexagonal Architecture, the UI is not a special layer; it is treated as just another "adapter." It is a user-facing adapter that translates user actions (like button clicks) into calls to the application and translates application events into on-screen updates.

1.  **Application Façade (`App.ts`)**
    *   The UI does not interact directly with the `AuthUsecase`. Instead, it communicates through `App.ts`, which serves as a clean, public-facing API or **façade** for the application. This façade exposes simple methods like `pwdLogin()`, `oauthLogin()`, and `logout()`.

2.  **Event-Driven Communication (`index.html` script)**
    *   Communication is decoupled using an event emitter. The UI is not responsible for polling the application's state. Instead, it subscribes to events and reacts to them.
    *   The `App.ts` façade emits events like `loginSuccess`, `loginError`, and `logout`.
    *   The script in `index.html` listens for these events and updates the DOM accordingly (e.g., hiding the login form and showing a success message).

3.  **The Flow of Interaction**
    *   A user clicks the "Login" button in `index.html`.
    *   The UI's event listener calls the public `app.pwdLogin(...)` method on the façade.
    *   The façade orchestrates the call to the `AuthUsecase` with the appropriate adapter.
    *   When the use case is complete, the façade emits a `loginSuccess` or `loginError` event.
    *   The UI's listener catches the event and updates the HTML to reflect the new state.

This approach ensures the core application remains completely ignorant of the DOM, HTML, or CSS. You could replace the entire `index.html` with a command-line interface (CLI) or a different web framework without changing any of the core application logic.

### Architectural Pros & Cons

#### Advantages

*   **High Testability**: The core `AuthUsecase` can be unit-tested in complete isolation by providing mock adapters, without needing a browser, database, or network calls.
*   **Flexibility & Maintainability**: External technologies can be swapped out with minimal effort. The `LocalStorageAdapter` could be replaced with a `CookieStorageAdapter` without touching the application code. Likewise, the entire UI could be rebuilt in React without altering the `App.ts` façade or the core logic.
*   **Technology Agnostic Core**: The business logic is not coupled to any specific framework or platform. This makes it highly portable and resilient to technological change.

#### Disadvantages

*   **Increased Boilerplate**: Requires more files and interfaces (ports) compared to a simple layered architecture. For extremely small or trivial projects, this can feel like overkill.
*   **Steeper Learning Curve**: The concepts of dependency inversion, ports, and adapters can be abstract and require an initial mental shift for developers accustomed to traditional layered architectures.