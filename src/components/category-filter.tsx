import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Category {
  id: string
  name: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`flex items-center gap-2 rounded-full ${
              selectedCategory === category.id ? "bg-primary text-primary-foreground" : ""
            }`}
            size="sm"
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
