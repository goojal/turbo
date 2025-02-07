// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "./Sport.sol";
import "./ManagedByLink.sol";

abstract contract ResolvesByScore is Sport, ManagedByLink {
    function resolveEvent(
        uint256 _eventId,
        SportsEventStatus _eventStatus,
        uint256 _homeTeamId, // for verifying team stability
        uint256 _awayTeamId, // for verifying team stability
        uint256 _homeScore,
        uint256 _awayScore
    ) public onlyLinkNode {
        SportsEvent storage _event = sportsEvents[_eventId];

        require(_event.status == SportsEventStatus.Scheduled);
        require(SportsEventStatus(_eventStatus) != SportsEventStatus.Scheduled);

        if (eventIsNoContest(_event, _eventStatus, _homeTeamId, _awayTeamId, WhoWonUnknown)) {
            resolveInvalidEvent(_eventId);
        } else {
            resolveValidEvent(_event, _homeScore, _awayScore);
        }

        sportsEvents[_eventId].status = _eventStatus;
    }

    function resolveValidEvent(
        SportsEvent memory _event,
        uint256 _homeScore,
        uint256 _awayScore
    ) internal virtual;
}
