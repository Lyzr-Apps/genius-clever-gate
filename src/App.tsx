import React from 'react'
import { useBouncingBall } from './hooks/useBouncinBall'

function App() {
  const { balls, containerRef, isRunning, toggleAnimation, resetBalls, addBall } = useBouncingBall(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="p-6">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          🏀 Bouncing Ball Animation
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleAnimation}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRunning ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={resetBalls}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          >
            Reset
          </button>

          <button
            onClick={addBall}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
          >
            Add Ball
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative w-full h-96 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden"
          style={{ height: '500px' }}
        >
          {balls.map((ball, index) => (
            <div
              key={index}
              className="absolute rounded-full transition-transform"
              style={{
                left: `${ball.x - ball.radius}px`,
                top: `${ball.y - ball.radius}px`,
                width: `${ball.radius * 2}px`,
                height: `${ball.radius * 2}px`,
                backgroundColor: ball.color,
                boxShadow: `0 0 20px ${ball.color}40`
              }}
            />
          ))}
        </div>

        <div className="text-center mt-6 text-gray-300">
          <p>Balls: {balls.length} | Status: {isRunning ? 'Running' : 'Paused'}</p>
          <p className="text-sm mt-2">Click the buttons above to control the animation!</p>
        </div>
      </div>
    </div>
  )
}

export default App
