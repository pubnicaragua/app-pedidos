import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs"

export function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="mb-6">
      <TabsList className="w-full justify-start overflow-x-auto">
        {categories.map((category) => (
          <TabsTrigger key={category} value={category} className="px-4 py-2">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

