'use client';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/doc-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    const json: Record<string, string> = await response.json();
    setAnswer(json.text);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='z-10 max-w-5xl w-full items-center space-evenly font-mono text-sm lg:flex'>
        <form action='' method='post' onSubmit={onSubmit}>
          <label htmlFor='query'>Ask a question</label>
          <input
            type='text'
            name='query'
            id='query'
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button type='submit'>Search</button>
        </form>
      </div>
      <div>{answer && <p>{answer}</p>}</div>
    </main>
  );
}
