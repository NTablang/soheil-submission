import dynamic from 'next/dynamic'


const DynamicPolygonAnnotation = dynamic(() => import('./PolygonAnnotation'), {
    ssr: false,
  })

export default DynamicPolygonAnnotation