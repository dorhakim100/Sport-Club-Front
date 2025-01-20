import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

import { useSelector } from 'react-redux'

export function Percentage({ percentages }) {
  const openMessages = useSelector(
    (stateSelector) => stateSelector.messageModule.openLength
  )
  const openOrders = useSelector(
    (stateSelector) => stateSelector.paymentModule.openLength
  )

  percentages = openOrders / (openOrders + openMessages)
  percentages = Math.floor(percentages * 100)

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const data = {
    labels: prefs.isEnglish ? ['Orders', 'Messages'] : ['הזמנות', 'הודעות'],
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
