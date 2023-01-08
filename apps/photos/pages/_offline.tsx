import { ErrorPage } from 'components/error-page';

export default function PageOffline() {
  return (
    <ErrorPage
      text={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 368 193.39">
          <path
            className="cls-1"
            d="M55.61,114.79c.31-1.85,.61-3.77,.91-5.77,.39-2.65,.76-5.33,1.12-8.04,.35-2.7,.69-5.32,1-7.86,.32-2.54,.59-4.84,.82-6.89l-4.04-.51-.95,.23h-18.09c.12-.58,.23-1.16,.34-1.74,.43-2.27,.85-4.46,1.24-6.55h29.45v-5.1H20.14v5.1h12.07c-.33,2.03-.71,4.15-1.15,6.38-.52,2.69-1.07,5.4-1.65,8.12-.58,2.73-1.15,5.32-1.71,7.79-.56,2.46-1.12,4.67-1.68,6.61h25.32c-.09,.63-.18,1.27-.28,1.9-.33,2.23-.66,4.34-.97,6.33H18.35v5.15h50.68v-5.15h-13.42Zm-22.52-13.16c.12-.5,.23-1.01,.35-1.54,.54-2.45,1.1-5.02,1.66-7.73,.1-.48,.2-.95,.29-1.43h18.06c-.07,.55-.13,1.12-.21,1.71-.3,2.37-.64,4.92-1.01,7.64-.06,.45-.12,.9-.19,1.35h-18.95Zm92.89,15.68c-.37,.33-.78,.75-1.23,1.26-.45,.5-.87,1.03-1.26,1.59s-.72,1.07-.98,1.52c-3.84-1.91-7.01-4.68-9.49-8.32-1.21-1.77-2.28-3.67-3.22-5.71-.97,2.52-2.42,5.04-4.34,7.53-1.96,2.54-4.6,4.91-7.92,7.11-.42-.56-1.01-1.21-1.8-1.96-.78-.75-1.51-1.34-2.18-1.79,3.14-1.94,5.61-4.03,7.42-6.27,1.81-2.24,3.14-4.5,3.98-6.78,.67-1.81,1.14-3.56,1.41-5.26h-10.57v-4.87h11.03c.04-.76,.06-1.49,.06-2.19v-6.94h-9.86v-4.87h6.87c-.49-1.18-1.23-2.59-2.25-4.23-1.03-1.66-2.1-3.13-3.22-4.4l4.31-2.07c1.12,1.23,2.22,2.63,3.28,4.2s1.84,2.95,2.32,4.14l-4.33,2.36h6.89c.59-.91,1.2-1.93,1.84-3.06,.73-1.28,1.41-2.6,2.04-3.94,.64-1.35,1.18-2.56,1.63-3.64l5.37,1.45c-1.08,1.94-2.22,3.9-3.41,5.88-.73,1.21-1.43,2.31-2.11,3.31h7.15v4.87h-11.2v7.05c0,.67-.02,1.37-.05,2.08h13.1v4.87h-13.38c1.19,3.77,2.92,7.14,5.2,10.11,2.39,3.11,5.36,5.44,8.9,6.97Zm-28.61-11.87c-1.4,.21-2.8,.43-4.2,.64v-29.26h2.24v-4.76h-21.39v4.76h2.8v31.8c-1.21,.16-2.33,.32-3.36,.46l1.06,4.92c3.14-.56,6.76-1.19,10.86-1.9,1.07-.18,2.14-.37,3.2-.55v10.18h4.59v-10.98c1.5-.26,2.99-.52,4.48-.78l-.28-4.53Zm-15.85-17.2h7.06v7.12h-7.06v-7.12Zm7.06-11.42v7.06h-7.06v-7.06h7.06Zm-7.06,31.1v-8.14h7.06v7.04c-2.46,.39-4.81,.75-7.06,1.1Zm90.89-1.42l-3.59,3.25c-.67-1.5-1.53-3.16-2.57-4.99-.44-.77-.91-1.56-1.4-2.36-2.05,5.16-4.75,9.48-8.12,12.95-.26-.26-.66-.58-1.18-.95-.52-.38-1.04-.74-1.57-1.1-.52-.35-.99-.64-1.4-.86,2.43-2.21,4.47-4.88,6.14-8.04,1.12-2.12,2.1-4.42,2.94-6.88-.99-1.43-2-2.84-3.06-4.24-1.43-1.9-2.86-3.67-4.28-5.32l3.25-2.85c1.49,1.64,2.97,3.4,4.42,5.26,.43,.55,.85,1.1,1.26,1.64,.81-3.35,1.46-6.9,1.93-10.65l4.76,.5c-.75,5.44-1.82,10.45-3.2,15.02,1.11,1.6,2.11,3.17,3.04,4.69,1.08,1.79,1.96,3.44,2.63,4.93Zm6.66-33.49v42.06c0,1.57-.22,2.78-.67,3.64-.45,.86-1.19,1.51-2.24,1.96-1.05,.41-2.41,.67-4.09,.78-1.68,.11-3.82,.17-6.44,.17-.07-.52-.23-1.1-.47-1.74-.25-.63-.5-1.28-.76-1.93-.26-.65-.52-1.2-.78-1.65,1.23,.04,2.43,.08,3.61,.11,1.17,.04,2.21,.05,3.11,.03,.89-.02,1.53-.03,1.9-.03,.52-.03,.91-.16,1.15-.36,.24-.21,.36-.55,.36-1.04v-36.96h-36.23v33.66c2.23-2.13,4.11-4.72,5.66-7.73,1.01-1.99,1.91-4.12,2.7-6.39-1.13-1.54-2.29-3.07-3.49-4.59-1.42-1.79-2.78-3.47-4.09-5.04l3.08-3.08c1.39,1.54,2.79,3.19,4.2,4.96,.63,.79,1.26,1.58,1.88,2.37,.86-3.47,1.54-7.12,2.04-10.97l4.82,.51c-.81,5.43-1.91,10.46-3.32,15.07,.86,1.16,1.68,2.29,2.45,3.38,1.14,1.62,2.1,3.09,2.89,4.4l-3.31,3.58c-.74-1.31-1.69-2.8-2.83-4.48-.34-.5-.69-1.01-1.04-1.52-2,5.05-4.61,9.29-7.83,12.72-.26-.26-.65-.58-1.15-.95-.5-.37-1.03-.74-1.57-1.09-.41-.27-.77-.51-1.09-.7v9.46h-5.32v-48.61h46.87Zm58.86,41.39c-.41,.33-.86,.77-1.35,1.31-.48,.54-.95,1.1-1.4,1.68-.44,.58-.82,1.09-1.12,1.54-2.16-1.12-4.33-2.46-6.49-4.03-2.17-1.57-4.26-3.3-6.27-5.21-2.02-1.9-3.9-3.91-5.66-6.02-.46-.55-.9-1.11-1.34-1.67v19.73h-5.6v-19.47c-.38,.49-.78,.98-1.18,1.47-1.75,2.11-3.65,4.1-5.68,5.99-2.04,1.89-4.14,3.6-6.3,5.15-2.17,1.55-4.34,2.9-6.5,4.06-.3-.48-.68-1.01-1.15-1.57-.46-.56-.94-1.11-1.43-1.65-.48-.54-.93-.98-1.34-1.31,2.16-.97,4.32-2.15,6.47-3.53,2.14-1.38,4.22-2.9,6.21-4.57,2-1.66,3.83-3.43,5.49-5.32,.96-1.09,1.84-2.18,2.64-3.27h-19.13v-5.27h21.9v-8.56h-17.81v-5.27h17.81v-8.85h5.6v8.85h18.25v5.27h-18.25v8.56h22.23v5.27h-19.5c.81,1.1,1.72,2.19,2.7,3.27,1.68,1.85,3.52,3.63,5.51,5.32,2,1.7,4.07,3.23,6.22,4.6,2.15,1.36,4.3,2.53,6.47,3.5Zm15.85-37.27c-.9-1.18-1.85-2.36-2.86-3.56-1.01-1.19-2-2.28-2.97-3.25l-4.03,2.64c.93,1.04,1.89,2.19,2.88,3.44s1.92,2.47,2.78,3.67c.86,1.19,1.51,2.26,1.96,3.19l4.36-3.02c-.52-.9-1.23-1.94-2.12-3.11Zm38.64,23.15v4.99h-12.88v9.24h-5.44v-9.24h-16.85v-4.99h16.85v-6.49h-8.23c-1.31,0-2.44,.07-3.41,.22-.98,.15-1.59,.38-1.85,.67-.08-.41-.22-.91-.42-1.51-.21-.59-.43-1.22-.67-1.87-.25-.66-.48-1.23-.7-1.71,.56-.11,1.08-.49,1.56-1.12,.49-.64,1.01-1.46,1.57-2.47,.3-.48,.71-1.27,1.23-2.35,.49-1.01,1.02-2.2,1.58-3.58h-7.01v-4.59h8.79c.06-.18,.13-.37,.2-.56,.62-1.72,1.15-3.46,1.6-5.21l5.54,1.51c-.47,1.42-.98,2.84-1.54,4.26h19.24v4.59h-21.14c-.85,1.94-1.73,3.79-2.64,5.57-.58,1.13-1.16,2.2-1.74,3.22h8.04v-6.27h5.44v6.27h10.36l-.06,4.93h-10.3v6.49h12.88Zm1.9,14.4c-.19,.48-.4,1.08-.64,1.79-.25,.71-.46,1.43-.65,2.18-.18,.75-.3,1.38-.33,1.91-1.01,.07-2.33,.14-3.95,.22-1.63,.07-3.37,.14-5.24,.2-1.86,.05-3.73,.1-5.6,.14-1.86,.03-3.51,.05-4.93,.05-3.69,0-6.8-.21-9.32-.64-2.52-.43-4.83-1.24-6.92-2.44-1.23-.78-2.32-1.56-3.27-2.32-.95-.77-1.73-1.15-2.33-1.15-.56,0-1.19,.36-1.9,1.06-.71,.71-1.45,1.64-2.21,2.78-.77,1.13-1.54,2.32-2.33,3.55l-3.92-5.21c1.91-2.2,3.77-3.96,5.6-5.29,.87-.63,1.69-1.11,2.47-1.44v-16.62h-6.95v-4.87h12.04v21.99s.04,.03,.06,.05c.9,.72,2.16,1.57,3.81,2.54,1.9,1.2,4.12,1.96,6.66,2.27,2.54,.32,5.45,.48,8.74,.48,1.6,0,3.34-.03,5.21-.09,1.86-.05,3.75-.14,5.65-.25,1.91-.11,3.74-.25,5.49-.42,1.75-.17,3.34-.32,4.76-.47Zm53.37-39.43v4.54h-30.69v-4.54h12.41c-.09-.2-.19-.4-.29-.61-.65-1.35-1.29-2.58-1.93-3.7l4.93-.73c.75,1.05,1.45,2.22,2.1,3.53,.27,.54,.51,1.04,.72,1.51h12.75Zm-4.61,27.67h6.57v-4.48h-19.38c.84-1.59,1.56-3.14,2.19-4.65l-4.88-.95c-.75,1.76-1.66,3.63-2.73,5.6h-10.48v4.48h7.88c-.34,.57-.69,1.13-1.05,1.68-1.23,1.9-2.43,3.58-3.58,5.04,2.35,.71,4.81,1.55,7.39,2.52,1.23,.46,2.45,.94,3.66,1.44-.85,.42-1.75,.8-2.71,1.13-3.32,1.16-7.47,1.98-12.43,2.47,.41,.52,.81,1.21,1.2,2.07,.39,.86,.68,1.64,.87,2.35,4.14-.6,7.76-1.37,10.86-2.32,2.9-.9,5.41-2.02,7.53-3.37,1.96,.91,3.79,1.81,5.52,2.72,2.13,1.12,3.92,2.19,5.38,3.19l3.3-4.03c-1.57-1.04-3.44-2.11-5.63-3.19-1.42-.7-2.91-1.41-4.48-2.1,.65-.73,1.25-1.5,1.8-2.32,1.36-2.06,2.43-4.48,3.2-7.28Zm-9.22,6.91c-.2,.22-.41,.43-.63,.64-1.77-.72-3.54-1.4-5.31-2.04-1.03-.37-2.05-.72-3.04-1.04,.42-.62,.84-1.26,1.28-1.93,.53-.82,1.06-1.67,1.58-2.54h10.02c-.89,2.76-2.2,5.06-3.9,6.91Zm15.17-16.99h-33.88v-4.6h9.29c-.29-.9-.75-1.93-1.36-3.1-.69-1.33-1.41-2.53-2.16-3.62l4.09-1.62c.78,1.05,1.54,2.21,2.27,3.5,.72,1.29,1.26,2.4,1.59,3.33l-3.52,1.51h8.49c.47-.73,.95-1.53,1.44-2.43,.54-.99,1.07-2,1.57-3.03,.51-1.02,.93-1.95,1.26-2.77l4.87,1.4c-.86,1.53-1.72,3.05-2.6,4.57-.48,.82-.94,1.58-1.39,2.26h10.04v4.6Zm-34.83,6.21c-1.77,.58-3.54,1.14-5.32,1.71v14.92c0,1.31-.15,2.34-.45,3.08-.3,.75-.82,1.33-1.57,1.74-.71,.41-1.64,.69-2.8,.84-1.15,.15-2.57,.2-4.25,.17-.08-.67-.25-1.5-.53-2.47-.28-.97-.59-1.79-.93-2.46,1.09,.04,2.06,.06,2.94,.06h1.77c.63,0,.95-.32,.95-.96v-13.4c-2.09,.65-4.03,1.23-5.83,1.76l-1.23-5.1c1.97-.49,4.32-1.13,7.06-1.93v-11.34h-6.27v-4.93h6.27v-10.92h4.87v10.92h5.21v4.93h-5.21v9.92c1.52-.45,3.05-.9,4.59-1.35l.73,4.81Z"
          />
        </svg>
      }
      showAction
      actionHint="要不，"
      actionText="再试一次"
      onActionButtonClick={() => {
        location?.reload();
      }}
    />
  );
}