import { useEffect } from 'react';
import moment from 'moment';
import { Comment, Tooltip } from 'antd';
import {
    Message as MessageData,
    Thread,
    Sender,
    useMarkMessageSeenMutation,
    useMeQuery
} from '../../queries';

type Props = {
    thread: Partial<Thread>;
    message: Partial<MessageData>;
};

export default function Message({ thread, message }: Props) {
    const [meResult] = useMeQuery({
        requestPolicy: 'cache-only'
    });
    const [, markMessageSeen] = useMarkMessageSeenMutation();

    useEffect(() => {
        if (message.sender !== Sender.Self && !message.seen) {
            markMessageSeen({
                id: message.id as number
            });
        }
    }, [message, markMessageSeen]);

    const author = message.sender === Sender.Other ? thread.name : meResult.data?.me.name;

    return (
        <div>
            <Comment
                author={author}
                content={message.body}
                datetime={
                    <Tooltip
                        title={moment(Number(message.createdAt)).format('YYYY-MM-DD HH:mm:ss')}
                    >
                        <span>{moment(Number(message.createdAt)).fromNow()}</span>
                    </Tooltip>
                }
            />
        </div>
    );
}
