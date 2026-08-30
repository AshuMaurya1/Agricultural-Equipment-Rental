# Tailwind CSS Quick Reference Guide

## Common Shortcuts & Utilities

### Spacing
```
p-4    → padding: 1rem (all sides)
px-4   → padding-left & padding-right
py-2   → padding-top & padding-bottom
m-4    → margin: 1rem (all sides)
mx-auto → margin-left & margin-right: auto
gap-4  → gap between flex/grid items
```

### Sizing
```
w-full    → width: 100%
w-1/2     → width: 50%
h-screen  → height: 100vh
h-8       → height: 2rem
max-w-md  → max-width: 28rem
aspect-video → aspect-ratio: 16/9
```

### Display & Layout
```
flex         → display: flex
flex-col     → flex-direction: column
flex-row     → flex-direction: row (default)
grid         → display: grid
grid-cols-3  → grid-template-columns: repeat(3, 1fr)
block        → display: block
hidden       → display: none
```

### Flexbox Alignment
```
items-center      → align-items: center
items-start       → align-items: flex-start
justify-center    → justify-content: center
justify-between   → justify-content: space-between
self-center       → align-self: center
```

### Responsive Breakpoints
```
sm:  → @media (min-width: 640px)
md:  → @media (min-width: 768px)
lg:  → @media (min-width: 1024px)
xl:  → @media (min-width: 1280px)

max-sm: → below 640px
max-md: → below 768px
```

### Typography
```
text-sm       → font-size: 0.875rem
text-base     → font-size: 1rem
text-lg       → font-size: 1.125rem
text-2xl      → font-size: 1.5rem
font-bold     → font-weight: 700
font-semibold → font-weight: 600
text-center   → text-align: center
uppercase     → text-transform: uppercase
capitalize    → text-transform: capitalize
```

### Colors & Backgrounds
```
bg-blue-500      → background-color: rgb(59, 130, 246)
text-gray-700    → color: rgb(55, 65, 81)
border-red-300   → border-color: rgb(252, 165, 165)
hover:bg-blue-600 → applies on hover
focus:ring-2     → applies on focus
```

### Borders
```
border       → border: 1px solid
border-2     → border: 2px solid
border-t     → border-top only
border-b     → border-bottom only
rounded      → border-radius: 0.25rem
rounded-lg   → border-radius: 0.5rem
rounded-full → border-radius: 9999px
```

### Real Examples
```jsx
// Navigation bar
className='flex flex-col md:flex-row items-center gap-4 p-4'

// Responsive container
className='max-sm:p-2 md:p-4 max-w-full'

// Mobile-first dropdown
className='max-sm:fixed max-sm:h-screen max-sm:w-full md:relative'

// Grid layout
className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'

// Button styling
className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
```

## Tips
- Use `flex` for 1D layouts, `grid` for 2D
- Always use responsive prefixes: `sm:`, `md:`, `lg:`
- Use `max-sm:` for mobile-first approach
- Combine utilities: `p-4 m-2 text-lg font-bold`
- Check [tailwindcss.com](https://tailwindcss.com) for complete docs
