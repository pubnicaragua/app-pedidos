import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryList({ categories }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Hola. ¿Qué vas a pedir hoy?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/category/${category.slug}`}  // Usamos "to" para react-router-dom
            className="relative overflow-hidden rounded-lg aspect-[4/3] group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            <img alt='category'  >
            </img>
            <span className="absolute bottom-3 left-3 text-white font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
