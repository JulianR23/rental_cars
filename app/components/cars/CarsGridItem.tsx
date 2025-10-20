"use client"
import { FC, useState } from 'react';
import { Car } from "../../lib/memoryDb";
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  car: Car
}

export const CarGridItem: FC<Props> = ({ car }) => {
  const images = car.imageUrl && car.imageUrl.length > 0 ? car.imageUrl : [];
  const [displayImage, setDisplayImage] = useState(images[0] || '');

  const handleMouseEnter = () => {
    if (images.length > 1) {
      setDisplayImage(images[1]);
    }
  };

  const handleMouseLeave = () => {
    if (images.length > 0) {
      setDisplayImage(images[0]);
    }
  };

  return (
    <div style={{
      borderRadius: '0.375rem',
      overflow: 'hidden',
      maxWidth: '100%'
    }}>
      <Link href={`/car/${car.id}`}>
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '300px',
          backgroundColor: '#f3f4f6'
        }}>
          <Image 
            src={displayImage}
            alt={car.model}
            fill
            style={{ 
              objectFit: 'cover'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </Link>
      <div style={{ 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Link 
          href={`/car/${car.id}`} 
          style={{ 
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          {car.brand} {car.model}
        </Link>
        <span style={{ fontWeight: 'bold' }}>${car.pricePerDay}/día</span>
      </div>
    </div>
  );
}