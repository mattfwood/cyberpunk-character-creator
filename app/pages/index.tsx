import React, { useState } from 'react';
import produce from 'immer';
import Layout from 'app/core/layouts/Layout';
import type { BlitzPage } from 'blitz';
import { XIcon } from '@heroicons/react/outline';

type Character = {
  name: string;
  currentHealth: number;
  maxHealth: number;
  initiative: number;
  turnComplete: boolean;
};

type CharacterCardProps = Character & {
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  index: number;
};

const Label = ({ children }) => (
  <div className="text-[#c7c7c7] text-sm uppercase">{children}</div>
);

const CharacterCard = ({
  name,
  currentHealth,
  maxHealth,
  initiative,
  setCharacters,
  index,
}: // turnComplete,
CharacterCardProps) => {
  const [turnComplete, setTurnComplete] = useState(false);
  function handleChange(e) {
    setCharacters((prev) => {
      const result = produce(prev, (draft) => {
        let value: string | number | boolean = e.target.value;

        if (e.target.type === 'number') {
          value = parseInt(e.target.value);
        } else if (e.target.type === 'checkbox') {
          value = e.target.checked;
        }

        // @ts-ignore
        draft[index][e.target.name] = value;
      });

      return result;
    });
  }

  function handleDelete() {
    const confirm = window.confirm(
      'Are you sure you want to delete this character?'
    );

    if (confirm) {
      setCharacters((prev) => {
        const result = produce(prev, (draft) => {
          draft.splice(index, 1);
        });

        return result;
      });
    }
  }

  return (
    <div
      className={`border-2 border-primary divide-y divide-primary relative ${
        turnComplete ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <button
        tabIndex={-1}
        onClick={handleDelete}
        className="bg-primary hover:bg-primary-focus text-black hover:text-white w-5 h-5 absolute right-0 top-0"
      >
        <XIcon />
      </button>
      <div className="flex items-center pl-2">
        <input
          type="checkbox"
          className="bg-primary focus:ring-0 text-primary border-none outline-none focus:outline-none focus:bg-primary-focus checked:bg-primary-focus hover:bg-primary-focus active:bg-primary-focus"
          name="turnComplete"
          onChange={(e) => setTurnComplete(e.target.checked)}
          checked={turnComplete}
        />
        <input
          value={name}
          type="text"
          name="name"
          className="clear-input text-white text-xl font-bold"
          onChange={handleChange}
        />
      </div>
      <div className="flex divide-x divide-primary">
        <div className="p-3">
          <Label>Initiative</Label>
          <input
            onChange={handleChange}
            type="number"
            name="initiative"
            className="w-14"
            value={initiative}
          />
        </div>
        <div className="p-3">
          <Label>HP</Label>
          <input
            type="number"
            name="currentHealth"
            className="w-14"
            value={currentHealth}
            onChange={handleChange}
          />
          <span> / </span>
          <input
            type="number"
            name="maxHealth"
            className="w-14"
            value={maxHealth}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

const samplePlayer = {
  name: 'Johnny Hellmouth',
  currentHealth: 10,
  maxHealth: 20,
  initiative: 5,
  turnComplete: false,
};

const initialCharacters = [
  { ...samplePlayer, name: 'Guy 1', initiative: 10 },
  { ...samplePlayer, name: 'guy 2', initiative: 10 },
  { ...samplePlayer, name: 'guy 3', initiative: 15 },
];

const HomePage: BlitzPage = () => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [roundTimestamp, setRoundTimestamp] = useState(Date.now());

  function addCharacter() {
    const newCharacter = {
      name: '',
      currentHealth: 0,
      maxHealth: 0,
      initiative: 0,
      turnComplete: false,
    };
    setCharacters((prev) => [...prev, newCharacter]);
  }

  const sortedCharacters = [...characters].sort(
    (a, b) => b.initiative - a.initiative
  );

  const startNewRound = () => {
    setRoundTimestamp(Date.now());
  };

  return (
    <Layout>
      <div className="space-y-4" key={roundTimestamp}>
        {sortedCharacters.map((character, index) => (
          <CharacterCard
            key={index}
            {...character}
            name={`${character.name}`}
            index={index}
            setCharacters={setCharacters}
          />
        ))}
      </div>
      <div className="mt-4 space-x-2 flex">
        <button className="cyber-button" onClick={addCharacter}>
          Add Character
        </button>
        <button className="cyber-button" onClick={startNewRound}>
          New Round
        </button>
      </div>
    </Layout>
  );
};

export default HomePage;
