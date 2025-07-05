import Layout from '@/components/Layout';

const QASimpleTest = () => {
  console.log('QASimpleTest component rendering');
  
  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Q&A Simple Test
          </h1>
          <div className="text-center">
            <p>This is a simple test page.</p>
            <p>If you can see this, the component is working.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QASimpleTest;
