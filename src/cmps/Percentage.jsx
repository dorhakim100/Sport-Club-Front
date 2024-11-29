import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

export function Percentage({ percentages }) {
  percentages = Math.floor(percentages)
  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Tasks Completion',
        data: [percentages, 100 - percentages], // These values are percentages
        backgroundColor: ['#4CAF50', '#FFC107'],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  }

  return (
    <div
      style={{ width: '300px', height: '200px', position: 'relative' }}
      className='chart-container'
    >
      <Doughnut data={data} options={options} />
    </div>
  )
}
