/**
 * WebComponentWrapper
 * 기존 JavaScript 컴포넌트 클래스를 Web Components(Custom Elements)로 변환하는 래퍼
 *
 * 역할:
 * - JS 컴포넌트를 HTML 커스텀 태그로 등록
 * - HTML 속성(attributes)을 컴포넌트 props로 자동 변환
 * - Shadow DOM 격리 (선택 가능)
 * - 컴포넌트별 CSS 자동 로드
 */
class WebComponentWrapper {
  /**
   * 커스텀 엘리먼트 등록
   *
   * @param {string} tagName - 커스텀 태그 이름 (예: 'empty-message')
   * @param {class} ComponentClass - 컴포넌트 클래스 (constructor(props)와 render/rendering 메서드 필요)
   * @param {object} options - 등록 옵션
   *   - observedAttributes: 모니터링할 HTML 속성 배열 (이 속성이 변경되면 리렌더링)
   *   - attributeToProp: HTML 속성명을 props 키로 변환하는 함수 (기본: 그대로)
   *   - useShadow: Shadow DOM 사용 여부 (기본: true, 스타일 격리)
   *   - styleUrl: 컴포넌트 CSS 파일 경로 (예: '/css/components/empty-message.css')
   *
   * 사용 예:
   * WebComponentWrapper.register('empty-message', EmptyLobbyMessage, {
   *   observedAttributes: ['message', 'repeat'],
   *   useShadow: true,
   *   styleUrl: '/css/components/empty-message.css'
   * });
   * // HTML에서: <empty-message message="안녕" repeat="3"></empty-message>
   */
  static register(tagName, ComponentClass, options = {}) {
    // 옵션 기본값 설정
    const {
      observedAttributes = [],
      attributeToProp = (n) => n,
      useShadow = true,
      styleUrl = null,
    } = options;

    // 이미 등록된 태그는 중복 등록 방지
    if (customElements.get(tagName)) return;

    // HTMLElement를 상속받아 커스텀 엘리먼트 클래스 생성
    class WrappedElement extends HTMLElement {
      /**
       * HTML 속성 변경 감지 목록
       * 이 배열의 속성이 HTML에서 변경되면 attributeChangedCallback이 호출됨
       */
      static get observedAttributes() {
        return observedAttributes;
      }

      /**
       * 엘리먼트 생성자
       * Shadow DOM 또는 일반 DOM 구조 초기화
       */
      constructor() {
        super();
        // 컴포넌트에 전달할 props 저장소
        this._props = {};
        // 실제 컴포넌트 인스턴스
        this._component = null;

        // Shadow DOM 또는 일반 DOM 선택
        // useShadow=true: Shadow DOM (스타일 격리, 외부 CSS 영향 없음)
        // useShadow=false: 일반 DOM (전역 스타일 영향)
        this._root = useShadow ? this.attachShadow({ mode: "open" }) : this;

        // 콘텐츠를 담을 div 컨테이너
        // 목적: 리렌더링 시 콘텐츠만 지우고 <link> 스타일은 보존
        this._contentHost = document.createElement("div");

        // CSS 파일 로드
        if (styleUrl) {
          if (useShadow) {
            // Shadow DOM 내부: <link> 태그를 shadow root에 추가
            // 이렇게 하면 이 컴포넌트에만 스타일 적용됨
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = styleUrl;
            this._root.appendChild(link);
          } else {
            // 일반 DOM: 문서 head에 한 번만 추가 (중복 방지)
            // data-wc-style 속성으로 이미 로드된 스타일 확인
            const existing = document.querySelector(
              `link[data-wc-style="${tagName}"]`
            );
            if (!existing) {
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = styleUrl;
              link.setAttribute("data-wc-style", tagName);
              document.head.appendChild(link);
            }
          }
        }
        // 콘텐츠 컨테이너를 root에 추가
        this._root.appendChild(this._contentHost);
      }

      /**
       * 엘리먼트가 DOM에 추가되었을 때 호출되는 라이프사이클 훅
       * 초기화: HTML 속성 → props 변환 후 컴포넌트 렌더링
       */
      connectedCallback() {
        // HTML 속성 값을 this._props에 동기화
        this._syncAttributesToProps();
        // 컴포넌트 렌더링
        this._renderComponent();
      }

      /**
       * 관찰 대상 속성(observedAttributes)이 변경될 때 호출
       * 예: <empty-message message="새로운 메시지"></empty-message>
       * → message 속성이 변경되면 이 메서드 자동 호출
       */
      attributeChangedCallback(name, oldValue, newValue) {
        // 속성명을 props 키로 변환하여 저장
        this._props[attributeToProp(name)] = newValue;
        // 변경된 props로 컴포넌트 리렌더링
        this._renderComponent();
      }

      /**
       * HTML 속성 → this._props 동기화
       * observedAttributes에 나열된 속성을 모두 props로 복사
       */
      _syncAttributesToProps() {
        for (const attr of observedAttributes) {
          // HTML 속성값을 속성명 변환 함수에 통과시켜 props 키 생성
          this._props[attributeToProp(attr)] = this.getAttribute(attr);
        }
      }

      /**
       * 컴포넌트 인스턴스 생성 및 렌더링
       * 1. 이전 컴포넌트 정리 (destroy 메서드 호출)
       * 2. 새로운 컴포넌트 인스턴스 생성
       * 3. render/rendering 메서드 실행
       * 4. 결과를 DOM에 추가
       */
      _renderComponent() {
        // 기존 컴포넌트 정리 (destroy 메서드가 있으면 호출)
        if (this._component && typeof this._component.destroy === "function") {
          try {
            this._component.destroy();
          } catch (e) {
            // 정리 중 에러 무시
            /* ignore */
          }
        }

        // 새로운 컴포넌트 인스턴스 생성 (현재 props 전달)
        this._component = new ComponentClass(this._props || {});

        // render 또는 rendering 메서드 찾기
        // (컴포넌트 클래스에서 두 이름 중 하나 제공 예상)
        const renderFn = this._component.render || this._component.rendering;

        // 렌더링 메서드 실행 (DOM Node, 배열, 또는 HTML 문자열 반환 예상)
        const output =
          typeof renderFn === "function"
            ? renderFn.call(this._component)
            : null;

        // 콘텐츠 호스트 초기화 (기존 콘텐츠 제거)
        // <link> 태그는 _root 직계 자식이므로 영향 없음
        while (this._contentHost.firstChild)
          this._contentHost.removeChild(this._contentHost.firstChild);

        // 렌더링 결과가 없으면 종료
        if (!output) return;

        // 렌더링 결과에 따라 DOM에 추가
        if (output instanceof Node) {
          // 단일 DOM 노드 → 직접 추가
          this._contentHost.appendChild(output);
        } else if (Array.isArray(output)) {
          // DOM 노드 배열 → 각각 추가
          output.forEach((n) => {
            if (n instanceof Node) this._contentHost.appendChild(n);
          });
        } else if (typeof output === "string") {
          // HTML 문자열 → innerHTML로 파싱하여 추가
          this._contentHost.innerHTML = output;
        }
      }
    }

    // 커스텀 엘리먼트를 브라우저에 등록
    // 이제 <empty-message></empty-message> 같은 태그를 HTML에서 사용 가능
    customElements.define(tagName, WrappedElement);
  }
}

export default WebComponentWrapper;
