import Layout from '@/components/Layout';

const ItemsTest = () => {
  console.log('ItemsTest component rendering...');
  
  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">商品一覧テスト</h1>
          <p className="text-xl text-gray-600">テストページが正常に表示されています</p>
        </div>
      </div>
    </Layout>
  );
};

export default ItemsTest;
