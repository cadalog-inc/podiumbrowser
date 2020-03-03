export function renderSearchSuggestionv3(state, val) {
    return (
        state.tag.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
}