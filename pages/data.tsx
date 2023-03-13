import dynamic from 'next/dynamic';

const DynamicData = dynamic(() => import('../components/DataPartial'), {
    ssr: false,
  })

export default DynamicData;
