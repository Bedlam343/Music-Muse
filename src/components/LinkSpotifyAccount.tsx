import { ForwardedRef, forwardRef, useState } from 'react';
import Link from 'src/icons/Link';
import AccountIcon from 'src/icons/Account';
import UnlinkIcon from 'src/icons/Unlink';
import Tooltip from 'src/components/common/Tooltip';
import Modal from 'src/components/common/Modal';

type Props = {
  accountLink?: string;
  accountId?: string;
  handleConnect: () => void;
  animate: boolean;
  onSpotifyUnlink: () => void;
};

const LinkSpotifyAccount = forwardRef(
  (
    { accountLink, accountId, handleConnect, animate, onSpotifyUnlink }: Props,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [displayManageModal, setDisplayManageModal] = useState({
      open: false,
      canClose: true,
    });
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState({
      open: false,
      canClose: true,
    });

    const handleManage = () => {
      setDisplayManageModal({ open: true, canClose: true });
    };

    const handleUnlinkClick = () => {
      setDisplayManageModal({ open: true, canClose: false });
      setDisplayConfirmationModal({ open: true, canClose: true });
    };

    const handleUnlinkCancel = () => {
      setDisplayConfirmationModal({ open: false, canClose: true });
      setDisplayManageModal({ open: true, canClose: true });
    };

    const handleSpotifyUnlink = () => {
      setDisplayConfirmationModal({ open: false, canClose: true });
      setDisplayManageModal({ open: false, canClose: true });
      onSpotifyUnlink();
    };

    const renderManageModal = () => {
      if (displayManageModal) {
        return (
          <Modal
            open={displayManageModal.open}
            onClose={() =>
              setDisplayManageModal({ open: false, canClose: true })
            }
          >
            <div
              className="bg-stone-800 border-2 border-stone-600 px-8 py-4
              rounded-lg flex flex-col items-center gap-[20px]"
            >
              <p className="text-stone-300 text-xl">
                Manage <span className="text-spotifyGreen">Spotify</span>{' '}
                Account
              </p>

              <div
                className="mb-[5px] flex items-end gap-[5px] group
                hover:cursor-pointer "
              >
                <AccountIcon />
                <a
                  href={accountLink}
                  target="_blank"
                  className="text-stone-400  flex gap-[10px] border-b-[1px] border-b-spotifyGreen"
                >
                  <span className="text-stone-300  ">{accountId}</span>
                </a>
                <img
                  src="src/assets/arrow_outward.png"
                  className="w-[15px] h-[15px] transform transition-transform 
        duration-300 group-hover:-translate-y-2 ease-in-out"
                />
              </div>

              <Tooltip text="Unlink Spotify Account">
                <div
                  onClick={handleUnlinkClick}
                  className="flex gap-[10px] items-center hover:cursor-pointer
                  bg-stone-700 px-2 py-1 rounded-lg hover:bg-stone-600"
                >
                  <p className="text-stone-300">Unlink</p>
                  <UnlinkIcon height={20} width={20} />
                </div>
              </Tooltip>
            </div>
          </Modal>
        );
      }

      return null;
    };

    const renderConfirmationModal = () => {
      if (displayConfirmationModal) {
        return (
          <Modal
            open={displayConfirmationModal.open}
            onClose={() =>
              setDisplayConfirmationModal({ open: false, canClose: true })
            }
          >
            <div
              className="bg-stone-800 border-2 border-stone-600 px-8 py-4
              rounded-lg flex flex-col items-center gap-[30px] text-stone-300"
            >
              <div className="flex flex-col items-center">
                <p className="text-stone-300 text-lg">
                  Are you sure you want to unlink your{' '}
                  <span className="text-spotifyGreen">Spotify</span> Account?
                </p>

                <p className="text-red-400 text-sm">
                  WARNING: You'll no longer be able to save tracks from within
                  Music Muse
                </p>
              </div>

              <div className="flex w-full px-4 justify-between">
                <button
                  onClick={handleUnlinkCancel}
                  className="px-2 py-1 text-sm border-[1px] 
                  border-stone-700 rounded-lg hover:border-stone-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSpotifyUnlink}
                  className="bg-stone-700 px-2 py-1 text-sm 
                  rounded-lg hover:bg-stone-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </Modal>
        );
      }

      return null;
    };

    return (
      <>
        <div
          ref={ref}
          className={`flex flex-col items-center gap-[10px] px-4 py-3 
          rounded-lg ${animate ? '' : ''}`}
        >
          <img
            src="src/assets/spotify/full_logo_green.png"
            className="w-[150px] "
          />
          {accountId ? (
            <div className="flex flex-col items-center gap-[10px]">
              <div
                className="mt-[2px] flex items-end gap-[5px] 
              group border-b-[1px] border-transparent
               hover:cursor-pointer hover:border-b-[1px] 
               hover:border-b-spotifyGreen"
              >
                <a
                  href={accountLink}
                  target="_blank"
                  className="text-stone-400  flex gap-[10px]"
                >
                  <AccountIcon />
                  <span className="text-stone-300">{accountId}</span>
                </a>
                <img
                  src="src/assets/arrow_outward.png"
                  className="w-[15px] h-[15px] transform transition-transform 
        duration-300 group-hover:-translate-y-2 ease-in-out"
                />
              </div>
              <button
                onClick={handleManage}
                className="text-stone-300 text-sm border-[1px] px-2 py-1
              border-stone-600 rounded-lg"
              >
                Manage
              </button>
            </div>
          ) : (
            <div className="mt-[5px] flex items-center gap-[10px]">
              <p className="text-stone-400 pb-[2px]">Link Account:</p>
              <Tooltip text="Link Spotify Account" position="bottom">
                <Link onClick={handleConnect} width={25} height={25} />
              </Tooltip>
            </div>
          )}
        </div>

        {renderManageModal()}
        {renderConfirmationModal()}
      </>
    );
  }
);

export default LinkSpotifyAccount;
