function updateRunningTime() {
    const startDate = new Date('2026-05-15T00:00:00');
    const now = new Date();
    
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();
    
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }
    
    const sitetimeEl = document.getElementById('sitetime');
    if (sitetimeEl) {
        sitetimeEl.textContent = '💻 本站已运行 ' + years + ' 年 ' + months + ' 月 ' + days + ' 天 ' + hours + ' 小时 ' + minutes + ' 分 ' + seconds + ' 秒';
    }
}

function updateVisitorCount() {
    let count = localStorage.getItem('visitorCount');
    if (!count) {
        count = 0;
    }
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    const visitorCountEl = document.getElementById('visitorCount');
    if (visitorCountEl) {
        visitorCountEl.textContent = ' ' + count;
    }
}

function startTimers() {
    updateVisitorCount();
    updateRunningTime();
    setInterval(updateRunningTime, 1000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTimers);
} else {
    startTimers();
}

document.querySelectorAll('.tree-label').forEach(label => {
    label.addEventListener('click', function(e) {
        e.stopPropagation();
        const category = this.dataset.category;
        const toggle = this.dataset.toggle;
        
        if (toggle) {
            const children = this.nextElementSibling;
            if (children && children.classList.contains('tree-children')) {
                const isExpanded = this.classList.contains('expanded');
                const toggleIcon = this.querySelector('.toggle-icon i');
                const folderIcon = this.querySelector('.folder-icon i');
                
                if (isExpanded) {
                    this.classList.remove('expanded');
                    children.classList.remove('show');
                    if (toggleIcon) toggleIcon.className = 'fa fa-caret-right';
                    if (folderIcon) {
                        folderIcon.className = 'fa fa-folder';
                        this.querySelector('.folder-icon').className = 'folder-icon folder-closed';
                    }
                } else {
                    this.classList.add('expanded');
                    children.classList.add('show');
                    if (toggleIcon) toggleIcon.className = 'fa fa-caret-down';
                    if (folderIcon) {
                        folderIcon.className = 'fa fa-folder-open';
                        this.querySelector('.folder-icon').className = 'folder-icon folder-green';
                    }
                }
            }
        }
        
        if (category) {
            document.querySelectorAll('.tree-label').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            if (category === 'all') {
                document.querySelectorAll('.section').forEach(section => {
                    section.style.display = 'block';
                });
            } else {
                document.querySelectorAll('.section').forEach(section => {
                    if (section.dataset.section === category) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
            }
        }
    });
});

document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.dataset.category;
        document.querySelectorAll('.section').forEach(section => {
            if (section.dataset.section === category) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
});

document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

const searchInput = document.getElementById('searchInput');
const searchResultCount = document.getElementById('searchResultCount');

searchInput.addEventListener('input', function() {
    const keyword = this.value.trim().toLowerCase();
    const allCards = document.querySelectorAll('.card');
    let matchCount = 0;
    
    if (keyword === '') {
        allCards.forEach(card => {
            card.style.display = '';
        });
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'block';
        });
        document.querySelectorAll('.tree-label').forEach(label => {
            label.classList.remove('search-match', 'active');
            label.style.backgroundColor = '';
        });
        document.querySelectorAll('.tree-children').forEach(children => {
            const toggle = children.previousElementSibling;
            if (toggle && toggle.classList.contains('expanded')) {
                children.classList.add('show');
            } else {
                children.classList.remove('show');
            }
        });
        searchResultCount.textContent = '';
        return;
    }
    
    document.querySelectorAll('.tree-label').forEach(label => {
        label.classList.remove('search-match', 'active', 'expanded');
        label.style.backgroundColor = '';
    });
    document.querySelectorAll('.tree-children').forEach(children => {
        children.classList.remove('show');
    });
    document.querySelectorAll('.toggle-icon i').forEach(icon => {
        icon.className = 'fa fa-caret-right';
    });
    
    const sidebarMatches = new Set();
    const matchedLabels = [];
    
    document.querySelectorAll('.tree-label').forEach(label => {
        const itemText = label.querySelector('.item-text');
        if (itemText) {
            const text = itemText.textContent.toLowerCase();
            if (text.includes(keyword)) {
                label.classList.add('search-match');
                label.style.backgroundColor = 'rgba(255, 235, 59, 0.3)';
                matchedLabels.push(label);
                
                const category = label.dataset.category;
                if (category) {
                    sidebarMatches.add(category);
                }
            }
        }
    });
    
    matchedLabels.forEach(matchedLabel => {
        const toggle = matchedLabel.dataset.toggle;
        if (toggle) {
            matchedLabel.classList.add('expanded');
            const icon = matchedLabel.querySelector('.toggle-icon i');
            if (icon) icon.className = 'fa fa-caret-down';
            const children = matchedLabel.nextElementSibling;
            if (children && children.classList.contains('tree-children')) {
                children.classList.add('show');
            }
        }
        
        let currentLi = matchedLabel.parentElement;
        while (currentLi && currentLi.classList.contains('tree-item')) {
            const parentUl = currentLi.parentElement;
            if (parentUl && parentUl.classList.contains('tree-children')) {
                parentUl.classList.add('show');
                const parentLabel = parentUl.previousElementSibling;
                if (parentLabel && parentLabel.classList.contains('tree-label')) {
                    parentLabel.classList.add('expanded');
                    const icon = parentLabel.querySelector('.toggle-icon i');
                    if (icon) icon.className = 'fa fa-caret-down';
                }
            }
            currentLi = parentUl ? parentUl.parentElement : null;
        }
    });
    
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'block';
        let sectionHasMatch = false;
        const sectionName = section.dataset.section;
        const cards = section.querySelectorAll('.card');
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const desc = card.querySelector('.card-desc').textContent.toLowerCase();
            
            const cardMatch = title.includes(keyword) || desc.includes(keyword);
            const sidebarMatch = sidebarMatches.has(sectionName);
            
            if (cardMatch || sidebarMatch) {
                card.style.display = '';
                sectionHasMatch = true;
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (!sectionHasMatch) {
            section.style.display = 'none';
        }
    });
    
    if (matchCount > 0) {
        searchResultCount.textContent = '找到 ' + matchCount + ' 个相关资源';
    } else {
        searchResultCount.textContent = '未找到相关资源';
    }
});
