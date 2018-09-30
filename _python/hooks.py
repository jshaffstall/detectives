data = {'categories': {}, 'series': {}, 'authors': {}}

def process_info(info, site):
    # Use this to build up a dictionary of mappings of mysteries to
    # categories, series, etc
    #
    # Then create filters that can be used to ask for all the mysteries
    # belonging to a particular category, series, etc
    #
    # {% 'time travel' | categories %}
    # {% 'magic tree house' | series %}
    
    # Start with letting mysteries put category tags in, and collecting those
    # identify mysteries by layout?  
    
    global data
    
    if 'layout' in info and info['layout'] == 'mystery':
        
        # A mystery may have a list of categories
        if 'categories' in info:
            for category in info['categories']:
                if category not in data['categories']:
                    data['categories'][category] = {}
                    
                if 'mysteries' not in data['categories'][category]:
                    data['categories'][category]['mysteries'] = []
                
                data['categories'][category]['mysteries'].append(info)
                    
        # A mystery may appear as part of a series
        #
        # series:
        #     id: series-id
        #     order: numeric order of this item in series
        if 'series' in info:
            if info['series']['id'] not in data['series']:
                data['series'][info['series']['id']] = []
                
            data['series'][info['series']['id']].append(info)

        # A mystery will have one author
        #
        # author: author-name
        if 'author' in info:
            if info['author'] not in data['authors']:
                data['authors'][info['author']] = {}
                
            if 'mysteries' not in data['authors'][info['author']]:
                data['authors'][info['author']]['mysteries'] = []
                
            data['authors'][info['author']]['mysteries'].append(info)
            
    if 'layout' in info and info['layout'] == 'author':
        author_name = info['components'][-1]
        
        if author_name not in data['authors']:
            data['authors'][author_name] = {}
                
        data['authors'][author_name]['author'] = info
            
    if 'layout' in info and info['layout'] == 'category':
        category = info['components'][-1]
        
        if category not in data['categories']:
            data['categories'][category] = {}
            
        data['categories'][category]['category'] = info
                        