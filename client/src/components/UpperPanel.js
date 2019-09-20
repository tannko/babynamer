import React from 'react';
import SharedMessage from './SharedMessage';
import DropdownMenu from './DropdownMenu';
import ErrorMessage from './ErrorMessage';

function UpperPanel(props) {
  const isShared = props.partner === null ? false : true;
  const partner = props.partner === null ? null : props.partner.name;
  const isError = props.error === "" ? false : true;
  return(
    props.editor === 'owner' ?
                                  <div>
                                    <div className="d-flex align-items-center">
                                      <SharedMessage isShared={isShared} partner={partner} />
                                      <div className="d-flex justify-content-right">
                                        <DropdownMenu
                                          share={props.share}
                                          unshare={props.unshare}
                                          rename={props.rename}
                                          remove={props.remove}
                                          isShared={isShared} />
                                      </div>
                                    </div>
                                    { isError && <div className="d-flex"><ErrorMessage message={props.error}/></div>}
                                  </div>
                                : <div></div>
  );
}

export default UpperPanel;
