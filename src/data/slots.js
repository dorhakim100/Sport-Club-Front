const POOL_FAKE_USERS = [
  { name: 'Noam Levi', phone: '054-1112233' },
  { name: 'Maya Cohen', phone: '054-1112244' },
  { name: 'Lior Mizrahi', phone: '054-1112255' },
  { name: 'Yael Azulay', phone: '054-1112266' },
  { name: 'Omer Ben-David', phone: '054-1112277' },
  { name: 'Roni Vaknin', phone: '054-1112288' },
  { name: 'Tomer Shalev', phone: '054-1112299' },
  { name: 'Neta Koren', phone: '054-1113300' },
]

const GYM_FAKE_USERS = [
  { name: 'Eden Harel', phone: '054-2221133' },
  { name: 'Gal Rosner', phone: '054-2221144' },
  { name: 'Shira Dayan', phone: '054-2221155' },
  { name: 'Idan Peretz', phone: '054-2221166' },
  { name: 'Dana Sharabi', phone: '054-2221177' },
  { name: 'Amit Malka', phone: '054-2221188' },
  { name: 'Niv Saban', phone: '054-2221199' },
  { name: 'Tal Barkai', phone: '054-2222200' },
]

function formatHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`
}

function buildFacilitySlots({ facility, date, startHour, capacity, users, idOffset }) {
  return Array.from({ length: 12 }, (_, idx) => {
    const currentHour = startHour + idx
    const registrationCount = (idx % 5) + 2

    return {
      id: idOffset + idx + 1,
      capacity,
      facility,
      date,
      startTime: formatHour(currentHour),
      endTime: formatHour(currentHour + 1),
      registrations: Array.from({ length: registrationCount }, (_, userIdx) => {
        const user = users[(idx + userIdx) % users.length]
        return { ...user }
      }),
    }
  })
}

const DAILY_DATE = '2026-03-16'

const poolSlots = buildFacilitySlots({
  facility: 'pool',
  date: DAILY_DATE,
  startHour: 6,
  capacity: 14,
  users: POOL_FAKE_USERS,
  idOffset: 0,
})

const gymSlots = buildFacilitySlots({
  facility: 'gym',
  date: DAILY_DATE,
  startHour: 6,
  capacity: 12,
  users: GYM_FAKE_USERS,
  idOffset: 12,
})

export const SLOTS = [...poolSlots, ...gymSlots]
