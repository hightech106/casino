import { differenceInMinutes } from 'date-fns';
import { useEffect, useState, useCallback } from 'react';
// @mui
import { Card, Stack } from '@mui/material';
import { dispatch, useSelector } from 'src/store';
import { UpdateUnreadSupport } from 'src/store/reducers/auth';
// hooks
import useApi from 'src/hooks/use-api';
import { chatSocket } from 'src/utils/socket';
// types
import type { ISupportChatMessage } from 'src/types';
//
import ChatRoom from './chat/chat-room';
import ChatMessageList from './chat/chat-message-list';
import ChatMessageInput from './chat/chat-message-input';
import ChatHeaderDetail from './chat/chat-header-detail';
// types

// ----------------------------------------------------------------------
const USER_COLOR: any = {};

export default function ChatView() {
  const { get_support_chat } = useApi();

  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ISupportChatMessage[]>([]);
  const [agentChat, setAgentChat] = useState<boolean>(false);

  const getList = async () => {
    setLoading(true);
    const res = await get_support_chat();
    setLoading(false);
    if (!res?.data || !res.data.length) return;
    setMessages(res.data);
    res.data.forEach((row: any) => {
      USER_COLOR[row.userId] = row.userColor;
    });
    // @ts-ignore
    dispatch(UpdateUnreadSupport(0));
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    const delMessage = (msgId: string) => {
      if (msgId === "all")
        setMessages([]);
      else
        setMessages((prevMessages) => prevMessages.filter((e) => e._id !== msgId));
    }

    const getNewMessage = (newMsg: ISupportChatMessage) => {
      USER_COLOR[newMsg.senderId] = newMsg.userColor;
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      if (loading && newMsg.senderId !== user._id)
        setLoading(false);
    }

    chatSocket.on('support', getNewMessage);
    chatSocket.on('support_remove', delMessage);

    return () => {
      chatSocket.off('support_remove', delMessage);
      chatSocket.off('support', getNewMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);


  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      flexShrink={0}
      sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72, bgcolor:'#2B2F3D' }}
    >
      {/* {selectedConversationId ? ( */}
      <ChatHeaderDetail />
      {/* ) : (
        <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
      )} */}
    </Stack>
  );

  // const renderNav = (
  //   <ChatNav
  //     contacts={contacts}
  //     conversations={conversations}
  //     loading={conversationsLoading}
  //     selectedConversationId={selectedConversationId}
  //   />
  // );

  const renderMessages = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        bgcolor:'#2B2F3D'
      }}
    >
      <ChatMessageList messages={messages} loading={loading} />

      <ChatMessageInput
        agentChat={agentChat}
        disabled={!agentChat && loading}
        setLoading={setLoading}
        onAgentChat={() => setAgentChat(true)}
      />
    </Stack>
  );

  useEffect(() => {
    if (!messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.senderId !== user._id && !lastMsg.isAi) {
      const mins = differenceInMinutes(new Date(), new Date(lastMsg.createdAt));
      if (mins < 60)
        setAgentChat(true);
    }
  }, [messages, user._id]);

  return (
    <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
      {/* {renderNav} */}

      <Stack
        sx={{
          width: 1,
          height: 1,
          overflow: 'hidden',
          bgcolor:'#2B2F3D'
        }}
      >
        {renderHead}

        <Stack
          direction="row"
          sx={{
            width: 1,
            height: 1,
            overflow: 'hidden',
            borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          {renderMessages}

          <ChatRoom messages={messages} />
        </Stack>
      </Stack>
    </Stack>
  );
}
