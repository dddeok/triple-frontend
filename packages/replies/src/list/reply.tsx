import { useState, useCallback } from 'react'
import { useTranslation, TFunction } from 'next-i18next'
import styled from 'styled-components'
import {
  Container,
  FlexBox,
  List,
  SquareImage,
  Text,
} from '@titicaca/core-elements'
import { formatTimestamp, findFoldedPosition } from '@titicaca/view-utilities'
import { useAppCallback, useSessionCallback } from '@titicaca/ui-flow'
import { TransitionType } from '@titicaca/modals'
import { useNavigate } from '@titicaca/router'
import {
  useUriHash,
  useHistoryFunctions,
  useIsomorphicNavigation,
} from '@titicaca/react-contexts'
import ActionSheet from '@titicaca/action-sheet'

import { Reply as ReplyType, Writer } from '../types'
import { likeReply, unlikeReply } from '../replies-api-client'
import { useRepliesContext } from '../context'

const MoreActionsButton = styled.button`
  width: 19px;
  height: 19px;
  padding-left: 3px;
  margin-top: -3px;
  border: 0;
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(https://assets.triple.guide/images/btn-review-more@4x.png);
`

const ReactionBox = styled(FlexBox)`
  div {
    ::before {
      font-size: 12px;
      padding: 0 3px 0 4px;
      content: '·';
    }
  }
`

const ChildResourceListItem = styled(List.Item)`
  padding-left: 40px;
`

const MentionUser = styled.span`
  color: var(--color-blue);
  margin-right: 5px;
`

const ThanksButton = styled.button`
  border: none;
  outline: none;
  background: white;
  width: 14px;
  height: 14px;
  padding: 0;
  cursor: pointer;
`

const HASH_MORE_ACTION_SHEET = 'reply.more-action-sheet'
export const HASH_DELETE_CLOSE_MODAL = 'reply.delete-close-modal'

export default function Reply({
  reply,
  reply: {
    writer: { profileImage, name, href: writeHref },
    blinded,
    createdAt,
    content: { mentionedUser, text, markdownText },
    reactions,
    childrenCount,
    children,
    id,
    parentId,
    deleted,
    actionSpecifications: { delete: isMine, reply: actionReply, edit },
  },
  focusInput,
  fetchMoreReplies,
}: {
  reply: ReplyType
  focusInput: () => void
  fetchMoreReplies: (reply?: ReplyType) => void
}) {
  const { t } = useTranslation('common-web')

  const [likeReaction, setLikeReactions] = useState(reactions.like)
  const { setEditingMessage } = useRepliesContext()
  const { push, back } = useHistoryFunctions()
  const { asyncBack } = useIsomorphicNavigation()
  const navigate = useNavigate()
  const likeReactionCount = likeReaction?.count

  const handleMoreClick = useCallback(
    (id) => {
      push(`${HASH_MORE_ACTION_SHEET}.${id}`, { useRouter: true })
    },
    [push],
  )

  const handleWriteReplyClick = useSessionCallback(
    (actionReply: ReplyType['actionSpecifications']['reply']) => {
      setEditingMessage({
        parentMessageId: actionReply?.toMessageId || '',
        content: {
          mentioningUserUid: actionReply?.mentioningUserUid || '',
          mentioningUserName: actionReply?.mentioningUserName || '',
        },
      })

      focusInput()
    },
  )

  const handleEditReplyClick = ({
    mentionedUserName,
    mentionedUserUid,
    messageId,
    toMessageId,
    plaintext,
  }: ReplyType['actionSpecifications']['edit'] & {
    toMessageId?: string
    messageId?: string
  }) => {
    setEditingMessage({
      currentMessageId: messageId,
      parentMessageId: toMessageId,
      content: {
        plaintext,
        mentioningUserUid: mentionedUserUid,
        mentioningUserName: mentionedUserName,
      },
    })

    focusInput()
  }

  const handleDeleteReplyClick = useCallback(
    async ({
      mentionedUserName,
      mentionedUserUid,
      messageId,
    }: ReplyType['actionSpecifications']['edit'] & {
      messageId?: string
    }) => {
      setEditingMessage({
        currentMessageId: messageId,
        content: {
          mentioningUserUid: mentionedUserUid,
          mentioningUserName: mentionedUserName,
        },
      })

      await asyncBack(back)

      push(HASH_DELETE_CLOSE_MODAL)

      return true
    },
    [setEditingMessage, asyncBack, back, push],
  )

  const handleLikeReplyClick = useSessionCallback(
    async ({ messageId }: { messageId: string }) => {
      await likeReply({ messageId })

      setLikeReactions((prev) => ({
        count: (prev?.count || 0) + 1,
        haveMine: true,
      }))
    },
  )

  const handleUnlikeReplyClick = useSessionCallback(
    async ({ messageId }: { messageId: string }) => {
      await unlikeReply({ messageId })

      setLikeReactions((prev) => ({
        count: Math.max(0, (prev?.count || 0) - 1),
        haveMine: false,
      }))
    },
  )

  const handleReportReplyClick = useAppCallback(
    TransitionType.General,
    useCallback(
      (id: string) => {
        navigate(`/reply/${id}/report`)
      },
      [navigate],
    ),
  )

  const derivedText = deriveContent({
    text: text || markdownText || '',
    deleted,
    blinded,
    childrenCount,
    t,
  })

  const handleUserClick = useAppCallback(
    TransitionType.General,
    useSessionCallback(
      useCallback(
        (href) => {
          navigate(href)
        },
        [navigate],
      ),
    ),
  )

  return (
    <>
      <SquareImage
        floated="left"
        size="small"
        src={profileImage}
        borderRadius={20}
        alt={name || ''}
        onClick={() => handleUserClick(writeHref)}
      />

      <Container padding={{ left: 50, bottom: 3 }} margin={{ bottom: 20 }}>
        <FlexBox flex justifyContent="space-between" alignItems="start">
          <Container minWidth={80} maxWidth={135}>
            <Text
              size={15}
              bold
              ellipsis
              onClick={() => handleUserClick(writeHref)}
            >
              {name}
            </Text>
          </Container>

          <FlexBox padding={{ top: 3, left: 5 }} flex alignItems="start">
            <Text size={12} padding={{ right: 5 }} bold color="gray300">
              {formatTimestamp(createdAt)}
            </Text>

            <MoreActionsButton
              onClick={actionReply ? () => handleMoreClick(id) : undefined}
            />
          </FlexBox>
        </FlexBox>

        <Content
          mentionedUser={mentionedUser}
          blinded={!!blinded}
          deleted={!!deleted}
          text={derivedText}
        />

        {!deleted && !blinded ? (
          <ReactionBox
            padding={{ top: 7 }}
            flex
            alignItems="center"
            cursor="pointer"
          >
            {likeReaction?.haveMine ? (
              <ThanksButton
                onClick={() => handleUnlikeReplyClick({ messageId: id })}
                aria-label="unlike-button"
              >
                <img
                  width={14}
                  height={14}
                  src="https://assets.triple.guide/images/btn-lounge-thanks-on@3x.png"
                  alt="thanks on icon"
                />
              </ThanksButton>
            ) : (
              <ThanksButton
                onClick={() => handleLikeReplyClick({ messageId: id })}
                aria-label="like-button"
              >
                <img
                  width={14}
                  height={14}
                  src="https://assets.triple.guide/images/btn-lounge-thanks-off@3x.png"
                  alt="thanks off icon"
                />
              </ThanksButton>
            )}

            {likeReactionCount && likeReactionCount > 0 ? (
              <Text padding={{ left: 2 }} size={12} color="gray300" bold>
                {t('johayo-likereactioncount', { likeReactionCount })}
              </Text>
            ) : null}

            <Text
              padding={{ left: 2 }}
              size={12}
              color="gray300"
              bold
              onClick={() => handleWriteReplyClick(actionReply)}
            >
              {t('dabgeuldalgi')}
            </Text>
          </ReactionBox>
        ) : null}
      </Container>

      {childrenCount > children.length ? (
        <Text
          padding={{ left: 40 }}
          color="blue"
          size={14}
          bold
          cursor="pointer"
          inlineBlock
          onClick={() => fetchMoreReplies(reply)}
        >
          {t('ijeon-dabgeul-deobogi')}
        </Text>
      ) : null}

      {childrenCount > 0 ? (
        <List margin={{ top: 20 }}>
          {children.map((childReply) => (
            <ChildResourceListItem key={childReply.id} margin={{ bottom: 20 }}>
              <Reply
                reply={childReply}
                focusInput={focusInput}
                fetchMoreReplies={fetchMoreReplies}
              />
            </ChildResourceListItem>
          ))}
        </List>
      ) : null}

      <FeatureActionSheet
        isMine={isMine}
        title={
          isMine
            ? parentId
              ? t('nae-dabgeul')
              : t('nae-daesgeul')
            : parentId
            ? t('dabgeul')
            : t('daesgeul')
        }
        actionSheetHash={`${HASH_MORE_ACTION_SHEET}.${id}`}
        onEditClick={() =>
          handleEditReplyClick({
            ...edit,
            toMessageId: actionReply ? actionReply.toMessageId : '',
            messageId: id,
          })
        }
        onDeleteClick={() =>
          handleDeleteReplyClick({
            ...edit,
            messageId: id,
          })
        }
        onReportClick={async () => {
          await asyncBack(back)
          handleReportReplyClick(id)
        }}
      />
    </>
  )
}

function Content({
  text,
  mentionedUser,
  blinded,
  deleted,
}: {
  text: string
  mentionedUser?: Writer
  blinded: boolean
  deleted: boolean
}) {
  const { t } = useTranslation('common-web')

  const [unfolded, setUnfolded] = useState(false)
  const foldedPosition = findFoldedPosition(5, text)
  const navigate = useNavigate()

  const handleMentiondUserNameClick = useAppCallback(
    TransitionType.General,
    useCallback(
      (href) => {
        navigate(href)
      },
      [navigate],
    ),
  )

  return (
    <Container padding={{ top: 3 }}>
      <Text inline padding={{ top: 3, bottom: 5 }} size={15}>
        {!unfolded && foldedPosition ? (
          text.slice(0, foldedPosition)
        ) : (
          <>
            {mentionedUser && !blinded && (
              <MentionUser
                onClick={() => handleMentiondUserNameClick(mentionedUser.href)}
              >
                {mentionedUser?.name}
              </MentionUser>
            )}
            <Text
              size={15}
              lineHeight="18px"
              inlineBlock
              color={blinded || deleted ? 'gray300' : 'gray'}
            >
              {text}
            </Text>
          </>
        )}
      </Text>

      {!unfolded && foldedPosition ? (
        <Text
          inline
          color="blue"
          size={15}
          cursor="pointer"
          onClick={() => setUnfolded((prevState) => !prevState)}
        >
          {t('...deobogi')}
        </Text>
      ) : null}
    </Container>
  )
}

function FeatureActionSheet({
  isMine,
  title,
  actionSheetHash,
  onEditClick,
  onDeleteClick,
  onReportClick,
}: {
  isMine: boolean
  title: string
  actionSheetHash: string
  onEditClick: () => void
  onDeleteClick: () => void
  onReportClick: () => void
}) {
  const { t } = useTranslation('common-web')

  const uriHash = useUriHash()
  const { back } = useHistoryFunctions()

  return (
    <ActionSheet
      open={uriHash === actionSheetHash}
      onClose={back}
      title={title}
    >
      {isMine ? (
        <>
          <ActionSheet.Item onClick={onEditClick}>
            {t('sujeonghagi')}
          </ActionSheet.Item>
          <ActionSheet.Item onClick={onDeleteClick}>
            {t('sagjehagi')}
          </ActionSheet.Item>
        </>
      ) : (
        <ActionSheet.Item onClick={onReportClick}>
          {t('singohagi')}
        </ActionSheet.Item>
      )}
    </ActionSheet>
  )
}

function deriveContent({
  text,
  deleted,
  blinded,
  childrenCount,
  t,
}: {
  text: string
  deleted: boolean
  blinded: boolean
  childrenCount: number
  t: TFunction
}) {
  const contentText = {
    deleted: t('jagseongjaga-sagjehan-daesgeulibnida.'),
    blinded: t('dareun-sayongjayi-singoro-beulraindeu-doeeossseubnida.'),
  }

  const type =
    deleted || blinded
      ? deleted && childrenCount >= 0
        ? 'deleted'
        : 'blinded'
      : 'default'

  return type === 'default' ? text : contentText[type]
}
