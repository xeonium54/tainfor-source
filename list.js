document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const sourceFilter = document.getElementById('sourceFilter');
    const tagFilter = document.createElement('select');  // Add tag filter
    tagFilter.classList.add('form-select', 'mb-3');
    const problemList = document.getElementById('problemList');

    let combinedProblems = [];
    const tagsSet = new Set();  // Store tags for Codeforces problems

    // Fetch Codeforces and UVa problems and combine them
    fetch('https://codeforces.com/api/problemset.problems')
        .then(response => response.json())
        .then(data => {
            const codeforcesProblems = data.result.problems.map(problem => {
                // Collect unique tags for the tag filter
                problem.tags.forEach(tag => tagsSet.add(tag));

                return {
                    id: problem.contestId + '_' + problem.index,
                    name: problem.name,
                    tags: problem.tags,
                    rating: problem.rating || 'N/A',
                    source: 'codeforces'
                };
            });
            return codeforcesProblems;
        })
        .then(codeforcesProblems => {
            fetch('https://uhunt.onlinejudge.org/api/p')
                .then(response => response.json())
                .then(uvaData => {
                    const uvaProblems = uvaData.map(problem => ({
                        id: problem[0],  // UVa Problem ID
                        name: problem[2],  // UVa Problem Title
                        dacu: problem[3],  // Number of Distinct Accepted Users
                        bestRuntime: problem[4],  // Best Runtime of an Accepted Submission
                        bestMemory: problem[5],  // Best Memory Used
                        source: 'uva',
                        tags: []  // UVa problems don't have tags, set as empty array
                    }));

                    // Combine both problem sets
                    combinedProblems = [...codeforcesProblems, ...uvaProblems];

                    // Populate the tag filter dropdown
                    populateTagFilter(tagsSet);

                    // Display initial combined list
                    displayProblems(combinedProblems);

                    // Event Listeners for searching, filtering by source and tags
                    searchInput.addEventListener('input', () => filterProblems(combinedProblems));
                    sourceFilter.addEventListener('change', () => filterProblems(combinedProblems));
                    tagFilter.addEventListener('change', () => filterProblems(combinedProblems));
                });
        });

    // Function to populate the tag filter dropdown
    function populateTagFilter(tags) {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'All Tags';
        tagFilter.appendChild(defaultOption);

        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });

        // Insert the tag filter into the DOM before the problem list
        sourceFilter.insertAdjacentElement('afterend', tagFilter);
    }

    function displayProblems(problems) {
        problemList.innerHTML = '';
        problems.forEach(problem => {
            const problemCard = document.createElement('div');
            problemCard.classList.add('col-md-4', 'mb-3');
            problemCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><a href="https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}">${problem.name}</a></h5>
                        <p class="card-text">Source: ${problem.source.charAt(0).toUpperCase() + problem.source.slice(1)}</p>
                        ${problem.source === 'codeforces' ? `
                            <p class="card-text">Difficulty: ${problem.rating}</p>
                            <p class="card-text">Tags: ${problem.tags.join(', ')}</p>
                        ` : `
                            <p class="card-text">DACU: ${problem.dacu}</p>
                            <p class="card-text">Best Runtime: ${problem.bestRuntime}</p>
                            <p class="card-text">Best Memory: ${problem.bestMemory}</p>
                        `}
                    </div>
                </div>
            `;
            problemList.appendChild(problemCard);
        });
    }

    function filterProblems(problems) {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedSource = sourceFilter.value;
        const selectedTag = tagFilter.value;

        const filteredProblems = problems.filter(problem => {
            const matchesSearch = problem.name.toLowerCase().includes(searchTerm);
            const matchesSource = selectedSource ? problem.source === selectedSource : true;
            const matchesTag = selectedTag ? problem.tags.includes(selectedTag) : true;

            return matchesSearch && matchesSource && matchesTag;
        });

        displayProblems(filteredProblems);
    }
});
``