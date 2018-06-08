/**
 * External dependencies
 */
import { get, partial } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, CategorySelect } from '@wordpress/components';
import { PostTypeSupportCheck } from '@wordpress/editor';
import { Component, compose } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import PostsSearch from '../../posts-search';

/**
 * Module Constants
 */
const PANEL_NAME = 'posts-panel';

class PostsPanel extends Component {
	constructor() {
		super( ...arguments );

		this.onCategoryChange = this.onCategoryChange.bind( this );
		this.onInputChange = this.onInputChange.bind( this );

		this.state = {
			categoryId: '',
			term: '',
		};
	}

	onCategoryChange( categoryId ) {
		this.setState( { categoryId } );
	}

	onInputChange( term ) {
		this.setState( { term } );
	}

	render() {
		const { isOpened, postType, onTogglePanel, categories } = this.props;
		const { categoryId, term } = this.state;

		return (
			<PostTypeSupportCheck supportKeys="posts">
				<PanelBody
					title={ get( postType, [ 'labels', 'posts' ], __( 'Posts' ) ) }
					opened={ isOpened }
					onToggle={ onTogglePanel }
				>
					<TextControl
						placeholder={ __( 'Search posts' ) }
						value={ term }
						onChange={ this.onInputChange }
					/>

					<CategorySelect
						key="query-controls-category-select"
						categoriesList={ categories }
						label={ __( 'Category' ) }
						noOptionLabel={ __( 'All' ) }
						selectedCategoryId={ categoryId }
						onChange={ this.onCategoryChange }
					/>

					<PostsSearch
						options={ { categoryId, term } }
					/>
				</PanelBody>
			</PostTypeSupportCheck>
		);
	}
}

const applyWithSelect = withSelect( ( select ) => {
	const { getPostType, getCategories, isRequestingCategories } = select( 'core' );
	const { getEditedPostAttribute } = select( 'core/editor' );
	const { isEditorSidebarPanelOpened } = select( 'core/edit-post' );

	return {
		postType: getPostType( getEditedPostAttribute( 'type' ) ),
		isOpened: isEditorSidebarPanelOpened( PANEL_NAME ),
		categories: getCategories(),
		isRequesting: isRequestingCategories(),
	};
} );

const applyWithDispatch = withDispatch( ( dispatch ) => {
	const { toggleGeneralSidebarEditorPanel } = dispatch( 'core/edit-post' );

	return {
		onTogglePanel: partial( toggleGeneralSidebarEditorPanel, PANEL_NAME ),
	};
} );

export default compose( [
	applyWithSelect,
	applyWithDispatch,
] )( PostsPanel );