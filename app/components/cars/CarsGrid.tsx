import React, { FC } from 'react'
import { Car } from "../../lib/memoryDb";
import { CarGridItem } from './CarsGridItem';

interface Props {
  cars: Car[]
}

export const CarsGrid: FC<Props> = ({ cars }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2.5rem',
      marginBottom: '2.5rem'
    }}>
      {
        cars.map(car => (
          <CarGridItem key={car.id} car={car} />
        ))
      }
    </div>
  )
}