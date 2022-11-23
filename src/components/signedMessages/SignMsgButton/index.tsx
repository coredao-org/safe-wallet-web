import { Button, Tooltip, IconButton } from '@mui/material'
import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import type { SyntheticEvent, ReactElement } from 'react'

import useWallet from '@/hooks/wallets/useWallet'
import Track from '@/components/common/Track'
import { MESSAGE_EVENTS } from '@/services/analytics/events/txList'
import useIsSignedMessageSignableBy from '@/hooks/useIsSignedMessageSignableBy'
import useIsSignedMessagePending from '@/hooks/useIsSignedMessagePending'
import MsgModal from '@/components/signedMessages/MsgModal'
import type { SignedMessage } from '@/store/signedMessagesSlice'

const SignMsgButton = ({ msg, compact = false }: { msg: SignedMessage; compact?: boolean }): ReactElement => {
  const [open, setOpen] = useState(false)
  const wallet = useWallet()
  const isSignable = useIsSignedMessageSignableBy(msg, wallet?.address || '')
  const isPending = useIsSignedMessagePending(msg.messageHash)

  const onClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  const isDisabled = !isSignable || isPending

  return (
    <>
      <Track {...MESSAGE_EVENTS.SIGN}>
        {compact ? (
          <Tooltip title="Sign" arrow placement="top">
            <span>
              <IconButton onClick={onClick} color="primary" disabled={isDisabled} size="small">
                <CheckIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <Button onClick={onClick} variant="contained" disabled={isDisabled} size="stretched">
            Sign
          </Button>
        )}
      </Track>

      {open && <MsgModal onClose={() => setOpen(false)} msg={msg} />}
    </>
  )
}

export default SignMsgButton