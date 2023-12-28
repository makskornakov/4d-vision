'use client';
import { useEffect, useState } from 'react';
import AnimatedCanvas from './components/Canvas';
import { Settings3D } from '@/classes/3dprojection';

export default function Home() {
  const [settings, setSettings] = useState<Settings3D>({
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    scale: {
      value: 1,
    },
  });

  return (
    <main>
      <h1>Canvas 3D - 4D experiments</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '60%',
          height: '10rem',
          outline: '1px solid red',
        }}
      >
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '40%',
            justifyContent: 'center',
            gap: '.5rem',
          }}
        >
          Scale:
          <input
            type="range"
            min=".2"
            max="3"
            step=".01"
            value={settings.scale.value}
            onChange={(e) =>
              setSettings((prev) => {
                const newSettings = { ...prev };
                newSettings.scale.value = e.target.valueAsNumber;
                return newSettings;
              })
            }
          />
          <span>{settings.scale.value}</span>
        </label>
        <div
          style={{
            width: '70%',
            height: '100%',
            outline: '1px solid blue',
            display: 'flex',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            // rowGap: '1rem',
          }}
        >
          {/* 3 labels with inputs for xyz rotation */}
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '.5rem',
            }}
          >
            X rotation:
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={settings.rotation.x}
              onChange={(e) =>
                setSettings((prev) => {
                  const newSettings = { ...prev };
                  newSettings.rotation.x = e.target.valueAsNumber;
                  return newSettings;
                })
              }
            />
            <span>{settings.rotation.x}</span>
          </label>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '.5rem',
            }}
          >
            Y rotation:
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={settings.rotation.y}
              onChange={(e) =>
                setSettings((prev) => {
                  const newSettings = { ...prev };
                  newSettings.rotation.y = e.target.valueAsNumber;
                  return newSettings;
                })
              }
            />
            <span>{settings.rotation.y}</span>
          </label>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '.5rem',
            }}
          >
            Z rotation:
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={settings.rotation.z}
              onChange={(e) =>
                setSettings((prev) => {
                  const newSettings = { ...prev };
                  newSettings.rotation.z = e.target.valueAsNumber;
                  return newSettings;
                })
              }
            />
            <span>{settings.rotation.z}</span>
          </label>
        </div>
      </div>

      <AnimatedCanvas settings={settings} />
    </main>
  );
}
