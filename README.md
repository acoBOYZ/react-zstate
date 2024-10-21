# useZState - A Custom State Management Hook with Zustand

`useZState` is a custom React hook that simplifies state management by leveraging [Zustand](https://github.com/pmndrs/zustand). It offers an efficient way to manage both global and local state with minimal boilerplate and excellent performance, thanks to Zustand’s lightweight and flexible API.

## Features

- **Efficient Global State Management**: Share state across your React application without the overhead of Context or Redux.
- **Performance Optimizations**: Benefit from Zustand’s selective re-rendering and subscription mechanisms.
- **Simple API**: An intuitive API similar to React’s useState hook.
- **No Serialization Overhead**: Direct state management without the need for serialization libraries.

## Installation
```bash
npm install @acoboyz/react-zstate
```

## Setup
No additional setup is required beyond installing Zustand. You can start using useZState in your components.

## Usage

#### Importing the Hook
```tsx
import { useZState } from '@acoboyz/react-zstate';
```

#### Basic Example
```tsx
Copy code
import React from 'react';
import { useZState } from '@acoboyz/react-zstate';

function Counter() {
  const [count, setCount, resetCount] = useZState<number>('counter', 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
      <button onClick={resetCount}>Reset</button>
    </div>
  );
}
```

#### Managing Complex Data Types
`useZState` can handle complex data types like objects and arrays effortlessly.

```tsx
import React from 'react';
import { useZState } from '@acoboyz/react-zstate';

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

function Profile() {
  const [user, setUser, resetUser] = useZState<UserProfile | null>('userProfile', null);

  const updateEmail = (email: string) => {
    setUser(prevUser => (prevUser ? { ...prevUser, email } : null));
  };

  return (
    <div>
      {user ? (
        <>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <button onClick={() => updateEmail('newemail@example.com')}>Update Email</button>
        </>
      ) : (
        <p>No user data available.</p>
      )}
      <button onClick={resetUser}>Reset Profile</button>
    </div>
  );
}
```

#### Resetting State
You can reset the state to its initial value using the `resetState` function.

```tsx
const [state, setState, resetState] = useZState(['myStateKey'], initialValue);

// To reset the state
resetState();
```

## How It Works

The `useZState` hook uses Zustand to manage stateful data efficiently. Here’s a brief overview:

- **State Initialization**: When you first call `useZState`, it initializes the state with the provided `initialData` for the given key.
- **State Management**: Zustand stores the state in a global store, allowing for shared state across components.
- **Selective Re-rendering**: Components that use useZState only re-render when the specific state slice they depend on changes.
- **State Updates**: Use the `setState` function to update the state. It supports both direct updates and updater functions (like React's `setState`).
- **State Reset**: The `resetState` function resets the state to its initial value.

## Benefits

- **Global State Without Additional Libraries**: Manage global state without needing Redux or Context API.
- **Performance Optimizations**: Leverage Zustand’s efficient state management to minimize unnecessary re-renders.
- **Simple API**: Designed to be as straightforward as React’s built-in hooks.
- **No Serialization Overhead**: Direct state management without the need for serialization libraries.

## Example: Todo List

```tsx
import React from 'react';
import { useZState } from '@acoboyz/react-zstate';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function TodoApp() {
  const [todos, setTodos, resetTodos] = useZState<Todo[]>('todos', []);

  const addTodo = (text: string) => {
    setTodos(prevTodos => [...prevTodos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <button onClick={() => addTodo('New Task')}>Add Todo</button>
      <button onClick={resetTodos}>Reset Todos</button>
      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ textDecoration: todo.completed ? 'line-through' : undefined }}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Advanced Usage

### Using with Local Storage
If you want to persist state across browser sessions, you can integrate `localStorage`:

```tsx
import { useZState } from '@acoboyz/react-zstate';
import { useEffect } from 'react';

function usePersistentState<T>(key: string, initialData: T) {
  const [state, setState, resetState] = useZState<T>(key, initialData);

  useEffect(() => {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      setState(JSON.parse(storedData));
    }
  }, [key, setState]);

  useEffect(() => {
    if (state !== undefined) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState, resetState] as const;
}
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/acoBOYZ/react-qstate).

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Zustand](https://github.com/pmndrs/zustand) for its lightweight and flexible state management.
  
##
By providing this hook, we aim to simplify state management in React applications, making it more efficient and developer-friendly. If you have any questions or need further assistance, please don’t hesitate to reach out.