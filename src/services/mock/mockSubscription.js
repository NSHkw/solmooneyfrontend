//src/services/mock/mockSubscription.js
import MOCKDATA from '../../assets/mockData.js';

// 수입 지출 mockData 테이블에서 속성이 구독 관련인 것 (MexpRpt=T, MexpType=E)들만 뽑아옴, 그다음 SubscriptionPage에서 대부분 계산하기 때문에 따로 api를 더 추가해야 할게 있나 싶음
// 수입 지출 테이블을 가져오는 mockExpense.js를 import해도 가능할지 모르겠음(아니면 통합해야 하나?)
// 구독을 계산하는 함수를 따로 만든다면?
// 구독 api, 구독 페이지, 구독 관련 계산파일, mockdata 이런식으로 될 텐데

// 맨 처음 useEffect할 때 구독관련 데이터가 바로 들어가게 되어야 함 (그 이후 계산)

const SUBSCRIPTION_API = {};

export default SUBSCRIPTION_API;
