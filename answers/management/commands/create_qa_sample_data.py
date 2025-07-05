from django.core.management.base import BaseCommand
from answers.models import Question, Answer, AnswerVote
from django.contrib.auth import get_user_model
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Q&Aのサンプルデータを作成します'

    def handle(self, *args, **options):
        self.stdout.write('Q&Aサンプルデータを作成中...')
        
        # 既存のQ&Aデータをクリア
        AnswerVote.objects.all().delete()
        Answer.objects.all().delete()
        Question.objects.all().delete()
        
        # テストユーザーを作成（存在しない場合）
        sample_users = []
        usernames = ['fashion_expert', 'style_lover', 'trendy_user', 'casual_fan', 'formal_master']
        
        for username in usernames:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@example.com',
                    'first_name': username.replace('_', ' ').title(),
                }
            )
            if created:
                user.set_password('password123')
                user.save()
            sample_users.append(user)
        
        # 質問データ
        questions_data = [
            {
                'title': '夏のオフィスカジュアルでおすすめのコーディネートを教えてください',
                'content': '''今年の夏、新しい職場でオフィスカジュアルのドレスコードがあります。
                
これまでフォーマルな服装しか経験がなく、どのような服装が適切かわからず困っています。

以下の条件でおすすめのコーディネートを教えていただけませんか？
- 20代後半の女性
- IT企業のオフィス
- エアコンが効いている環境
- 予算は1着あたり1万円程度

よろしくお願いします。''',
                'category': 'coordination',
                'user': sample_users[0]
            },
            {
                'title': 'デートでのメンズファッション、カジュアルすぎず決めすぎない服装のコツ',
                'content': '''今度初デートをすることになったのですが、服装で悩んでいます。

相手は同年代の女性で、カフェでのお茶からスタートする予定です。
カジュアルすぎず、でも決めすぎない程度の服装にしたいのですが、どのようなポイントに気をつければよいでしょうか？

- 25歳男性
- 身長175cm、普通体型
- 場所：おしゃれなカフェ
- 時間：土曜日の午後

アドバイスをお願いします！''',
                'category': 'styling',
                'user': sample_users[1]
            },
            {
                'title': '結婚式の二次会に参加する際の服装マナーについて',
                'content': '''友人の結婚式の二次会に参加することになりました。

会場はレストランで、ドレスコードは「セミフォーマル」と書かれています。
結婚式の二次会に参加するのは初めてで、どの程度フォーマルにすればよいのかわかりません。

以下の場合、どのような服装がおすすめでしょうか？
- 30代前半の女性
- 会場：レストラン（夜の時間帯）
- ドレスコード：セミフォーマル
- 新郎新婦とは大学時代の友人

NGな服装や、気をつけるべき点があれば教えてください。''',
                'category': 'other',
                'user': sample_users[2]
            },
            {
                'title': '体型カバーできる秋冬コーディネートのアイデア',
                'content': '''最近体型が気になり始めて、服選びに困っています。

特にお腹周りと二の腕が気になるのですが、体型をカバーしつつおしゃれに見える秋冬のコーディネートを教えてください。

- 40代女性
- 身長158cm
- ぽっちゃり体型
- 普段はパート勤務
- 予算：全身で3万円程度

着痩せ効果のあるアイテムや組み合わせのコツがあれば、ぜひ教えてください。''',
                'category': 'styling',
                'user': sample_users[3]
            },
            {
                'title': '大学生の就活面接でのスーツ選び、注意点を教えてください',
                'content': '''来年から就職活動が始まる大学3年生です。

初めてのスーツ購入で、何を基準に選べばよいかわからず相談させていただきます。

質問したい内容：
1. 色は黒とネイビーどちらがおすすめか
2. 値段の相場（学生の予算で）
3. 業界による違いはあるか（金融系志望）
4. シャツやネクタイの選び方

就活経験者の方や、面接官経験のある方からアドバイスをいただけると嬉しいです。''',
                'category': 'other',
                'user': sample_users[4]
            },
            {
                'title': '韓国ファッションを取り入れたい！おすすめブランドや着こなし方',
                'content': '''最近韓国ファッションに興味を持ち始めました。

K-POPアイドルのような、きれいめだけど少しカジュアルなスタイルに憧れています。

- 22歳女性大学生
- 身長162cm、細身
- 予算：月1-2万円程度
- 普段着からデート服まで幅広く

おすすめのブランドや通販サイト、着こなしのポイントを教えてください！
日本のブランドでも韓国風に見えるアイテムがあれば知りたいです。''',
                'category': 'brand',
                'user': sample_users[0]
            }
        ]
        
        # 質問を作成
        created_questions = []
        for q_data in questions_data:
            question = Question.objects.create(
                title=q_data['title'],
                content=q_data['content'],
                category=q_data['category'],
                user=q_data['user']
            )
            created_questions.append(question)
        
        # 回答データ
        answers_data = [
            # 質問1への回答
            {
                'question': created_questions[0],
                'content': '''オフィスカジュアルの夏コーディネート、おすすめをご紹介します！

**基本アイテム：**
1. **ブラウス（半袖・七分袖）** - 白、ライトブルー、ベージュなど
2. **テーパードパンツ** - ネイビー、グレー、ベージュ
3. **ジャケット** - 薄手のテーラードジャケット（エアコン対策）

**コーディネート例：**
- 白ブラウス + ネイビーのテーパードパンツ + ベージュのジャケット
- ライトブルーブラウス + グレーパンツ + 白のカーディガン

**ポイント：**
- 素材は通気性の良いコットンやリネン混がおすすめ
- 足元はパンプス（3-5cm程度のヒール）
- アクセサリーはシンプルに

ユニクロやGUでも十分素敵なアイテムが見つかりますよ！''',
                'user': sample_users[1]
            },
            {
                'question': created_questions[0],
                'content': '''IT企業でオフィスカジュアル経験があります！

夏の暑さ対策も含めて、以下がおすすめです：

**トップス：**
- 半袖のシャツブラウス
- カットソー（きれいめなもの）
- ポロシャツ（上品なデザイン）

**ボトムス：**
- アンクル丈のパンツ
- 膝丈のスカート
- ワイドパンツ（涼しくて楽）

**注意点：**
- 露出は控えめに（肩や膝は隠す）
- サンダルはNG、パンプスかローファーを
- デニムは避ける

ザラやH&Mでトレンド感のあるアイテムが予算内で見つかります。
最初は無難な色から始めて、慣れてきたら差し色を取り入れると良いですよ！''',
                'user': sample_users[2]
            },
            
            # 質問2への回答
            {
                'question': created_questions[1],
                'content': '''初デートの服装、とても大切ですね！

**おすすめコーディネート：**
- **トップス：** シャツ（白、水色、薄いピンク）
- **ボトムス：** チノパンまたはスラックス（ベージュ、ネイビー）
- **アウター：** カーディガンまたは薄手のジャケット
- **シューズ：** 革靴またはきれいめスニーカー

**ポイント：**
1. 清潔感が最重要！
2. サイズ感に注意（ジャストサイズを選ぶ）
3. 香水は控えめに
4. 靴は必ず磨いておく

**避けるべき：**
- ヨレヨレのTシャツ
- ダメージジーンズ
- サンダル
- 派手すぎる色や柄

相手のことを考えた服装選びができれば、きっと好印象ですよ！頑張ってください！''',
                'user': sample_users[3]
            },
            
            # 質問3への回答
            {
                'question': created_questions[2],
                'content': '''結婚式二次会の服装マナー、お答えします！

**セミフォーマルの基本：**
- **ワンピース** または **ブラウス+スカート/パンツ**
- 膝丈～ミモレ丈のスカート
- パンツスーツもOK

**色選び：**
✅ **OK：** ネイビー、グレー、ベージュ、ピンク、ブルー
❌ **NG：** 白（新婦の色）、黒一色（お葬式を連想）

**絶対NGなもの：**
- カジュアルすぎる服装（ジーンズ、Tシャツ）
- 露出の多い服装
- ファー素材
- オープントゥの靴
- スニーカー

**小物：**
- パール系のアクセサリー
- 小さめのバッグ（クラッチバッグなど）
- パンプス（3-7cm程度）

レストランなら少しカジュアルダウンしても大丈夫ですが、お祝いの席なので華やかさも大切に！''',
                'user': sample_users[4]
            },
            
            # 質問4への回答
            {
                'question': created_questions[3],
                'content': '''体型カバーコーディネート、私も同じ悩みを持っていました！

**お腹周りカバー：**
- **Aラインワンピース** - ウエスト位置が高めのもの
- **チュニック** - ヒップが隠れる丈
- **ロングカーディガン** - 縦のラインを強調

**二の腕カバー：**
- **七分袖** または **長袖** のトップス
- **カーディガン** を羽織る
- **ボレロ** でさりげなくカバー

**おすすめカラー：**
- ダークカラー（ネイビー、ブラック、チャコール）
- 縦ストライプ
- 単色使い

**避けるべき：**
- ボーダー（横のライン）
- ピタッとしすぎる服
- 明るすぎる色

**ブランド：**
- ユニクロ（プラスサイズも充実）
- ベルメゾン
- ニッセン

少しずつ試して、自分に似合うスタイルを見つけていきましょう！''',
                'user': sample_users[0]
            },
            
            # 質問5への回答
            {
                'question': created_questions[4],
                'content': '''就活スーツ選び、人事担当の経験からアドバイスします！

**1. 色について：**
- **ネイビー** がおすすめ！（真面目で知的な印象）
- 黒は冠婚葬祭の印象が強い
- 金融系なら特にネイビーが無難

**2. 予算相場：**
- 学生向け：3-5万円
- 青山、AOKI、コナカなどで学割あり
- 最初は1着あれば十分

**3. 業界による違い：**
金融系は特に保守的なので：
- シンプルなデザイン
- 無地
- 細身すぎないシルエット

**4. シャツ・ネクタイ：**
- **シャツ：** 白の無地（最低2-3枚）
- **ネクタイ：** 紺、エンジ、グレー系
- 派手な柄は避ける

**追加アドバイス：**
- 靴は黒の革靴（手入れを忘れずに）
- 鞄はA4が入るビジネスバッグ
- ベルトは靴と同色

頑張ってください！''',
                'user': sample_users[1]
            },
            
            # 質問6への回答
            {
                'question': created_questions[5],
                'content': '''韓国ファッション大好きです！おすすめをシェアしますね♪

**おすすめブランド：**

**プチプラ：**
- **DHOLIC** - 韓国の人気ブランド
- **STYLENANDA** - トレンド感抜群
- **CHUU** - 可愛い系からクール系まで

**日本で買えるもの：**
- **GU** - 韓国っぽいアイテム多数
- **UNIQLO U** - ミニマルで韓国風
- **H&M** - トレンドアイテム豊富

**韓国風コーデのポイント：**
1. **オーバーサイズ** を上手に取り入れる
2. **ハイウエスト** でスタイルアップ
3. **レイヤード** で今っぽく
4. **スニーカー** でカジュアルダウン

**基本アイテム：**
- オーバーサイズのスウェット
- プリーツスカート
- ハイウエストジーンズ
- 白スニーカー

インスタで韓国のファッショニスタをフォローするのもおすすめです！
#韓国ファッション で検索してみてください✨''',
                'user': sample_users[2]
            }
        ]
        
        # 回答を作成
        created_answers = []
        for a_data in answers_data:
            answer = Answer.objects.create(
                question=a_data['question'],
                content=a_data['content'],
                user=a_data['user']
            )
            created_answers.append(answer)
        
        # 投票データを作成（ランダムに投票）
        vote_count = 0
        for answer in created_answers:
            # 各回答に対してランダムに投票
            voters = random.sample(sample_users, random.randint(1, 4))
            for voter in voters:
                if voter != answer.user:  # 自分の回答には投票しない
                    AnswerVote.objects.create(
                        answer=answer,
                        user=voter,
                        is_helpful=True
                    )
                    vote_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Q&Aサンプルデータの作成が完了しました:\n'
                f'- ユーザー: {len(sample_users)}人\n'
                f'- 質問: {len(created_questions)}件\n'
                f'- 回答: {len(created_answers)}件\n'
                f'- 投票: {vote_count}件'
            )
        )
