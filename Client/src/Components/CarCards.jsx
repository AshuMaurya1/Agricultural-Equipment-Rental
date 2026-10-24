import TractorCard from './TractorCard'

/**
 * Backwards compatibility alias for TractorCard.
 * Renamed to eliminate residual automotive naming.
 */
const CarCards = (props) => {
  return <TractorCard {...props} />
}

export default CarCards
